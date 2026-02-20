import { HttpException, HttpStatus } from '@nestjs/common'

export class MatchNotFoundException extends HttpException {
    constructor() {
        super('Match not found', HttpStatus.NOT_FOUND)
    }
}

export class NotMatchParticipantException extends HttpException {
    constructor() {
        super('You are not a participant of this match', HttpStatus.FORBIDDEN)
    }
}

export class AvailabilityAlreadySetException extends HttpException {
    constructor() {
        super('You have already set availability for this match', HttpStatus.BAD_REQUEST)
    }
}
