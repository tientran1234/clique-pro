import { Injectable } from '@nestjs/common'
import { MatchesRepository } from './matches.repository'
import { GetMatchesQueryType, IdParamType } from './matches.model'
import { MatchNotFoundException } from './matches.error'

@Injectable()
export class MatchesService {
    constructor(private readonly repository: MatchesRepository) { }

    async getMatches(query: GetMatchesQueryType) {
        return await this.repository.getMatches(query)
    }

    async getMatch(param: IdParamType) {
        const result = await this.repository.getMatch(param)
        if (!result.item) {
            throw new MatchNotFoundException()
        }
        return result
    }
}
