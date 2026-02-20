import { Controller, Get, Query, Param } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { MatchesService } from './matches.service'
import { GetMatchesQueryDto, GetMatchesResDto, IdParamDto, GetMatchResDto } from './matches.dto'
import { ZodResponse } from 'nestjs-zod'

@ApiTags('Matches')
@Controller('matches')
export class MatchesController {
    constructor(private readonly service: MatchesService) { }

    @Get()
    @ApiOperation({ summary: 'Get all matches for a user' })
    @ZodResponse({ type: GetMatchesResDto })
    async getMatches(@Query() query: GetMatchesQueryDto) {
        return await this.service.getMatches(query)
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get match detail by ID' })
    @ZodResponse({ type: GetMatchResDto })
    async getMatch(@Param() param: IdParamDto) {
        return await this.service.getMatch(param)
    }
}
