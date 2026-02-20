import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateAvailabilityType, GetAvailabilitiesQueryType } from './availability.model'
import {
    MatchNotFoundException,
    NotMatchParticipantException,
    AvailabilityAlreadySetException,
} from './availability.error'
import { SerializeAll } from 'src/shared/decorator/serialize.decorator'
@SerializeAll()
@Injectable()
export class AvailabilityRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createAvailability(data: CreateAvailabilityType) {
        // Validate match exists
        const match = await this.prisma.match.findUnique({
            where: { id: data.matchId },
        })

        if (!match) {
            throw new MatchNotFoundException()
        }

        // Check if user is part of the match
        if (match.userAId !== data.userId && match.userBId !== data.userId) {
            throw new NotMatchParticipantException()
        }

        // Check if user already set availability
        const existing = await this.prisma.availability.findFirst({
            where: {
                userId: data.userId,
                matchId: data.matchId,
            },
        })

        if (existing) {
            throw new AvailabilityAlreadySetException()
        }

        // Create availability slots
        const availabilities = await this.prisma.$transaction(
            data.slots.map((slot) =>
                this.prisma.availability.create({
                    data: {
                        userId: data.userId,
                        matchId: data.matchId,
                        date: slot.date,
                        startTime: slot.startTime,
                        endTime: slot.endTime,
                    },
                }),
            ),
        )

        // Check if both users have set availability
        const userAAvailability = await this.prisma.availability.findFirst({
            where: { userId: match.userAId, matchId: data.matchId },
        })
        const userBAvailability = await this.prisma.availability.findFirst({
            where: { userId: match.userBId, matchId: data.matchId },
        })

        let commonSlot: any = null
        let message = 'Availability saved. Waiting for the other user to set availability.'

        if (userAAvailability && userBAvailability) {
            // Find common slot
            commonSlot = await this.findCommonSlot(data.matchId)

            if (commonSlot) {
                // Update match with proposed date and time
                await this.prisma.match.update({
                    where: { id: data.matchId },
                    data: {
                        hasScheduledDate: true,
                        proposedDate: commonSlot.date,
                        proposedTime: `${commonSlot.startTime}-${commonSlot.endTime}`,
                    },
                })
                const dateStr = new Date(commonSlot.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })
                message = `Match! You both have a date scheduled on ${dateStr} at ${commonSlot.startTime}-${commonSlot.endTime}`
            } else {
                message = 'No common time slot found. Please try setting different availability.'
            }
        }

        return {
            items: availabilities as any,
            commonSlot,
            message,
        }
    }

    async findCommonSlot(matchId: string) {
        const availabilities = await this.prisma.availability.findMany({
            where: { matchId },
            orderBy: { date: 'asc' },
        })

        const match = await this.prisma.match.findUnique({
            where: { id: matchId },
        })

        if (!match) return null

        const userASlots = availabilities.filter((a) => a.userId === match.userAId)
        const userBSlots = availabilities.filter((a) => a.userId === match.userBId)

        // Find first overlapping slot (same date)
        for (const slotA of userASlots) {
            for (const slotB of userBSlots) {
                // Check if same date
                const dateA = new Date(slotA.date).toISOString().split('T')[0]
                const dateB = new Date(slotB.date).toISOString().split('T')[0]
                if (dateA !== dateB) {
                    continue
                }

                // Compare time strings (HH:MM format)
                const startA = slotA.startTime
                const endA = slotA.endTime
                const startB = slotB.startTime
                const endB = slotB.endTime

                // Find overlap
                const overlapStart = startA > startB ? startA : startB
                const overlapEnd = endA < endB ? endA : endB

                if (overlapStart < overlapEnd) {
                    return {
                        date: slotA.date,
                        startTime: overlapStart,
                        endTime: overlapEnd,
                    }
                }
            }
        }

        return null
    }

    async getAvailabilities(query: GetAvailabilitiesQueryType) {
        const availabilities = await this.prisma.availability.findMany({
            where: { matchId: query.matchId },
            orderBy: { date: 'asc' },
        })

        return {
            items: availabilities as any,
            totalItems: availabilities.length,
        }
    }

    async deleteAvailability(id: string) {
        await this.prisma.availability.delete({
            where: { id },
        })

        return { message: 'Availability deleted successfully' }
    }
}
