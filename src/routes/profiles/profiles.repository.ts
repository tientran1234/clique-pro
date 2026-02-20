import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../prisma/prisma.service'
import {
    CreateProfileType,
    UpdateProfileType,
    IdParamType,
    EmailParamType,
    GetListProfilesQueryType,
} from './profiles.model'
import { ProfileNotFoundException, ProfileAlreadyExistsException } from './profiles.error'
import { SerializeAll } from '../../shared/decorator/serialize.decorator'

@Injectable()
@SerializeAll()
export class ProfilesRepository {
    constructor(private readonly prisma: PrismaService) { }

    async getListProfiles(query: GetListProfilesQueryType) {
        const { page, limit, search, gender, minAge, maxAge, orderBy, sortBy } = query

        const where: any = {}

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { bio: { contains: search, mode: 'insensitive' } },
            ]
        }

        if (gender) {
            where.gender = gender
        }

        if (minAge || maxAge) {
            where.age = {}
            if (minAge) where.age.gte = minAge
            if (maxAge) where.age.lte = maxAge
        }

        const skip = (page - 1) * limit

        const [items, totalItems, genderStats] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { [sortBy]: orderBy },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    age: true,
                    gender: true,
                    bio: true,
                    createdAt: true,
                },
            }),
            this.prisma.user.count({ where }),
            this.prisma.user.groupBy({
                by: ['gender'],
                _count: { _all: true },
            }),
        ])

        const statsAll = {
            male: genderStats.find((s) => s.gender === 'male')?._count._all ?? 0,
            female: genderStats.find((s) => s.gender === 'female')?._count._all ?? 0,
            other: genderStats.find((s) => s.gender === 'other')?._count._all ?? 0,
        }

        return {
            items: items as any,
            totalItems,
            page,
            limit,
            totalPages: Math.ceil(totalItems / limit),
            statsAll,
        }
    }

    async getProfile(param: IdParamType) {
        const user = await this.prisma.user.findUnique({
            where: { id: param.id },
            select: {
                id: true,
                email: true,
                name: true,
                age: true,
                gender: true,
                bio: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return { item: user }
    }

    async getProfileByEmail(param: EmailParamType) {
        const user = await this.prisma.user.findUnique({
            where: { email: param.email },
            select: {
                id: true,
                email: true,
                name: true,
                age: true,
                gender: true,
                bio: true,
                createdAt: true,
                updatedAt: true,
            },
        })

        return { item: user }
    }

    async createProfile(data: CreateProfileType) {
        const existing = await this.prisma.user.findUnique({
            where: { email: data.email },
        })

        if (existing) {
            throw ProfileAlreadyExistsException
        }

        const item = await this.prisma.user.create({
            data,
            select: {
                id: true,
                email: true,
                name: true,
                age: true,
                gender: true,
                bio: true,
                createdAt: true,
            },
        })

        return { item: item as any }
    }

    async updateProfile(data: UpdateProfileType) {
        const { id, ...updateData } = data

        await this.prisma.user.update({
            where: { id },
            data: updateData,
        })
    }

    async deleteProfile(param: IdParamType) {
        await this.prisma.user.delete({
            where: { id: param.id },
        })
    }
}
