import { Module } from '@nestjs/common'
import { MatchesController } from './matches.controller'
import { MatchesService } from './matches.service'
import { MatchesRepository } from './matches.repository'
import { SharedModule } from '../../shared/shared.module'

@Module({
    imports: [SharedModule],
    controllers: [MatchesController],
    providers: [MatchesService, MatchesRepository],
})
export class MatchesModule { }
