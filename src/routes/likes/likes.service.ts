import { Injectable } from '@nestjs/common'
import { LikesRepository } from './likes.repository'
import { CreateLikeType, GetLikesQueryType } from './likes.model'
import { PrismaService } from '../../prisma/prisma.service'
import { UserNotFoundException } from './likes.error'

@Injectable()
export class LikesService {
    constructor(
        private readonly repository: LikesRepository,
        private readonly prisma: PrismaService,
    ) { }

    async createLike(data: CreateLikeType) {
        // Validate both users exist
        const [fromUser, toUser] = await Promise.all([
            this.prisma.user.findUnique({ where: { id: data.senderId } }),
            this.prisma.user.findUnique({ where: { id: data.receiverId } }),
        ])

        if (!fromUser || !toUser) {
            throw new UserNotFoundException()
        }

        return await this.repository.createLike(data)
    }

    async getLikes(query: GetLikesQueryType) {
        return await this.repository.getLikes(query)
    }
}
