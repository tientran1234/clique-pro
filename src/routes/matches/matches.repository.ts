import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { GetMatchesQueryType, IdParamType } from './matches.model'
import { SerializeAll } from 'src/shared/decorator/serialize.decorator'
@SerializeAll()
@Injectable()
export class MatchesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getMatches(query: GetMatchesQueryType) {
        const matches = await this.prisma.match.findMany({
            where: {
                OR: [{ userAId: query.userId }, { userBId: query.userId }],
            },
            include: {
                userA: true,
                userB: true,
            },
            orderBy: { matchedAt: 'desc' },
        })

        // Fetch availabilities for each match
        const matchesWithAvailability = await Promise.all(
            matches.map(async (match) => {
                const availabilities = await this.prisma.availability.findMany({
                    where: { matchId: match.id },
                    orderBy: { date: 'asc' },
                })

                return {
                    ...match,
                    availabilities,
                }
            }),
        )

        return {
            items: matchesWithAvailability as any,
            totalItems: matchesWithAvailability.length,
        }
    }

    async getMatch(param: IdParamType) {
        const match = await this.prisma.match.findUnique({
            where: { id: param.id },
            include: {
                userA: true,
                userB: true,
            },
        })

        if (!match) {
            return { item: null }
        }

        // Fetch availabilities for this match
        const availabilities = await this.prisma.availability.findMany({
            where: { matchId: match.id },
            orderBy: { date: 'asc' },
        })

        return {
            item: {
                ...match,
                availabilities,
            } as any,
        }
    }
}
