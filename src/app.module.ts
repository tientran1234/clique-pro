import { Module } from '@nestjs/common'
import { APP_PIPE, APP_FILTER } from '@nestjs/core'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { SharedModule } from './shared/shared.module'
import { ProfilesModule } from './routes/profiles/profiles.module'
import { LikesModule } from './routes/likes/likes.module'
import { MatchesModule } from './routes/matches/matches.module'
import { AvailabilityModule } from './routes/availability/availability.module'
import CustomZodValidationPipe from './shared/pipes/zod-validation.pipe'
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter'
import { HttpExceptionFilter } from './shared/filters/http-exception.filter'

@Module({
  imports: [SharedModule, ProfilesModule, LikesModule, MatchesModule, AvailabilityModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: CustomZodValidationPipe,
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule { }
