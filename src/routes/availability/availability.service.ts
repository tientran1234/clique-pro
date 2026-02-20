import { Injectable } from '@nestjs/common'
import { AvailabilityRepository } from './availability.repository'
import { CreateAvailabilityType, GetAvailabilitiesQueryType } from './availability.model'

@Injectable()
export class AvailabilityService {
    constructor(private readonly repository: AvailabilityRepository) { }

    async createAvailability(data: CreateAvailabilityType) {
        return await this.repository.createAvailability(data)
    }

    async getAvailabilities(query: GetAvailabilitiesQueryType) {
        return await this.repository.getAvailabilities(query)
    }

    async deleteAvailability(id: string) {
        return await this.repository.deleteAvailability(id)
    }
}
