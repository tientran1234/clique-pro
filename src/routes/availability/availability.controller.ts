import { Controller, Post, Get, Delete, Body, Query, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { AvailabilityService } from './availability.service'
import {
    CreateAvailabilityDto,
    CreateAvailabilityResDto,
    GetAvailabilitiesQueryDto,
    GetAvailabilitiesResDto,
    IdParamDto,
    MessageResDto,
} from './availability.dto'
import { ZodResponse } from 'nestjs-zod'

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
    constructor(private readonly service: AvailabilityService) { }

    @Post()
    @ApiOperation({ summary: 'Set availability for a match (auto-find common slot)' })
    @ZodResponse({ type: CreateAvailabilityResDto })
    async createAvailability(@Body() body: CreateAvailabilityDto) {
        return await this.service.createAvailability(body)
    }

    @Get()
    @ApiOperation({ summary: 'Get all availabilities for a match' })
    @ZodResponse({ type: GetAvailabilitiesResDto })
    async getAvailabilities(@Query() query: GetAvailabilitiesQueryDto) {
        return await this.service.getAvailabilities(query)
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an availability slot' })
    @ZodResponse({ type: MessageResDto })
    async deleteAvailability(@Param() param: IdParamDto) {
        return await this.service.deleteAvailability(param.id)
    }
}
