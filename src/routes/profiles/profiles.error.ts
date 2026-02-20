import { NotFoundException } from '@nestjs/common'

export const ProfileNotFoundException = new NotFoundException({
    statusCode: 404,
    message: 'Profile not found',
    error: 'PROFILE_NOT_FOUND',
})

export const ProfileAlreadyExistsException = new NotFoundException({
    statusCode: 409,
    message: 'Profile with this email already exists',
    error: 'PROFILE_ALREADY_EXISTS',
})
