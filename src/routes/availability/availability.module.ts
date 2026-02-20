import { Module } from '@nestjs/common'
import { AvailabilityController } from './availability.controller'
import { AvailabilityService } from './availability.service'
import { AvailabilityRepository } from './availability.repository'
import { SharedModule } from '../../shared/shared.module'

@Module({
    imports: [SharedModule],
    controllers: [AvailabilityController],
    providers: [AvailabilityService, AvailabilityRepository],
})
export class AvailabilityModule { }
