import { Controller, Post, Get, Body, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { LikesService } from './likes.service'
import { CreateLikeDto, CreateLikeResDto, GetLikesQueryDto, GetLikesResDto } from './likes.dto'
import { ZodResponse } from 'nestjs-zod'

@ApiTags('Likes')
@Controller('likes')
export class LikesController {
    constructor(private readonly service: LikesService) { }

    @Post()
    @ApiOperation({ summary: 'Create a like (and auto-create match if mutual)' })
    @ZodResponse({ type: CreateLikeResDto })
    async createLike(@Body() body: CreateLikeDto) {
        return await this.service.createLike(body)
    }

    @Get()
    @ApiOperation({ summary: 'Get likes sent or received by a user' })
    @ZodResponse({ type: GetLikesResDto })
    async getLikes(@Query() query: GetLikesQueryDto) {
        return await this.service.getLikes(query)
    }
}
