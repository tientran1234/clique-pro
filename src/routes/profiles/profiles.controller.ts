import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common'
import { ZodResponse } from 'nestjs-zod'
import { ProfilesService } from './profiles.service'
import {
    CreateProfileDto,
    UpdateProfileDto,
    IdParamDto,
    EmailParamDto,
    GetListProfilesQueryDto,
    GetListProfilesResDto,
    GetProfileResDto,
    CreateProfileResDto,
    MessageResDto,
} from './profiles.dto'

@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @Get()
    @HttpCode(HttpStatus.OK)
    @ZodResponse({ type: GetListProfilesResDto })
    async getListProfiles(@Query() query: GetListProfilesQueryDto) {
        return await this.profilesService.getListProfiles(query)
    }

    @Get('by-email/:email')
    @HttpCode(HttpStatus.OK)
    @ZodResponse({ type: GetProfileResDto })
    async getProfileByEmail(@Param() param: EmailParamDto) {
        return await this.profilesService.getProfileByEmail(param)
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    @ZodResponse({ type: GetProfileResDto })
    async getProfile(@Param() param: IdParamDto) {
        return await this.profilesService.getProfile(param)
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ZodResponse({ type: CreateProfileResDto })
    async createProfile(@Body() dto: CreateProfileDto) {
        return await this.profilesService.createProfile(dto)
    }

    @Put(':id')
    @HttpCode(HttpStatus.OK)
    @ZodResponse({ type: MessageResDto })
    async updateProfile(@Body() dto: UpdateProfileDto) {
        return await this.profilesService.updateProfile(dto)
    }

    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    @ZodResponse({ type: MessageResDto })
    async deleteProfile(@Param() param: IdParamDto) {
        return await this.profilesService.deleteProfile(param)
    }
}
