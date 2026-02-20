import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import { CreateLikeType, GetLikesQueryType } from './likes.model'
import { LikeAlreadyExistsException, SelfLikeException } from './likes.error'

@Injectable()
export class LikesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async createLike(data: CreateLikeType) {
        // Check if self-like
        if (data.senderId === data.receiverId) {
            throw new SelfLikeException()
        }

        // Check if already liked
        const existingLike = await this.prisma.like.findFirst({
            where: {
                senderId: data.senderId,
                receiverId: data.receiverId,
            },
        })

        if (existingLike) {
            throw new LikeAlreadyExistsException()
        }

        // Create the like
        const like = await this.prisma.like.create({
            data,
        })

        // Check if there's a reverse like (match condition)
        const reverseLike = await this.prisma.like.findFirst({
            where: {
                senderId: data.receiverId,
                receiverId: data.senderId,
            },
        })

        let match: any = null
        if (reverseLike) {
            // Create a match (use alphabetical order for consistency)
            const [userAId, userBId] = [data.senderId, data.receiverId].sort()
            match = await this.prisma.match.create({
                data: {
                    userAId,
                    userBId,
                },
            })
        }

        return {
            item: like as any,
            isMatch: !!match,
            matchId: match?.id,
        }
    }

    async getLikes(query: GetLikesQueryType) {
        const where =
            query.type === 'sent'
                ? { senderId: query.userId }
                : { receiverId: query.userId }

        const likes = await this.prisma.like.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        })

        return {
            items: likes as any,
            totalItems: likes.length,
        }
    }

    async checkMutualLike(userId1: string, userId2: string): Promise<boolean> {
        const [like1, like2] = await Promise.all([
            this.prisma.like.findFirst({
                where: { senderId: userId1, receiverId: userId2 },
            }),
            this.prisma.like.findFirst({
                where: { senderId: userId2, receiverId: userId1 },
            }),
        ])

        return !!(like1 && like2)
    }
}
