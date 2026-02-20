import { HttpException, HttpStatus } from '@nestjs/common'

export class LikeAlreadyExistsException extends HttpException {
    constructor() {
        super('You have already liked this user', HttpStatus.BAD_REQUEST)
    }
}

export class SelfLikeException extends HttpException {
    constructor() {
        super('You cannot like yourself', HttpStatus.BAD_REQUEST)
    }
}

export class UserNotFoundException extends HttpException {
    constructor() {
        super('User not found', HttpStatus.NOT_FOUND)
    }
}
