import { Module } from '@nestjs/common'
import { LikesController } from './likes.controller'
import { LikesService } from './likes.service'
import { LikesRepository } from './likes.repository'
import { SharedModule } from '../../shared/shared.module'

@Module({
    imports: [SharedModule],
    controllers: [LikesController],
    providers: [LikesService, LikesRepository],
    exports: [LikesRepository],
})
export class LikesModule { }
