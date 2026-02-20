import { Injectable, Logger } from '@nestjs/common'
import { ProfilesRepository } from './profiles.repository'
import {
    CreateProfileType,
    UpdateProfileType,
    IdParamType,
    EmailParamType,
    GetListProfilesQueryType,
} from './profiles.model'
import { ProfileNotFoundException } from './profiles.error'

@Injectable()
export class ProfilesService {
    private readonly logger = new Logger(ProfilesService.name)

    constructor(private readonly repository: ProfilesRepository) { }

    async getListProfiles(query: GetListProfilesQueryType) {
        this.logger.log('Fetching profiles list')
        return await this.repository.getListProfiles(query)
    }

    async getProfile(param: IdParamType) {
        this.logger.log(`Fetching profile with ID: ${param.id}`)
        const result = await this.repository.getProfile(param)
        if (!result.item) {
            throw ProfileNotFoundException
        }
        return result as any
    }

    async getProfileByEmail(param: EmailParamType) {
        this.logger.log(`Fetching profile with email: ${param.email}`)
        const result = await this.repository.getProfileByEmail(param)
        if (!result.item) {
            throw ProfileNotFoundException
        }
        return result as any
    }

    async createProfile(data: CreateProfileType) {
        this.logger.log(`Creating profile for email: ${data.email}`)
        return await this.repository.createProfile(data)
    }

    async updateProfile(data: UpdateProfileType) {
        this.logger.log(`Updating profile with ID: ${data.id}`)

        // Verify exists
        const existing = await this.repository.getProfile({ id: data.id })
        if (!existing.item) {
            throw ProfileNotFoundException
        }

        await this.repository.updateProfile(data)
        return {
            message: 'Profile updated successfully',
        }
    }

    async deleteProfile(param: IdParamType) {
        this.logger.log(`Deleting profile with ID: ${param.id}`)

        // Verify exists
        const existing = await this.repository.getProfile(param)
        if (!existing.item) {
            throw ProfileNotFoundException
        }

        await this.repository.deleteProfile(param)
        return {
            message: 'Profile deleted successfully',
        }
    }
}
