import { createZodDto } from 'nestjs-zod'
import {
    CreateProfileSchema,
    UpdateProfileSchema,
    IdParamSchema,
    EmailParamSchema,
    GetListProfilesQuerySchema,
    GetListProfilesResSchema,
    GetProfileResSchema,
    CreateProfileResSchema,
} from './profiles.model'
import { MessageResSchema } from '../../shared/models/response.model'

// DTOs for request validation
export class CreateProfileDto extends createZodDto(CreateProfileSchema) { }
export class UpdateProfileDto extends createZodDto(UpdateProfileSchema) { }
export class IdParamDto extends createZodDto(IdParamSchema) { }
export class EmailParamDto extends createZodDto(EmailParamSchema) { }
export class GetListProfilesQueryDto extends createZodDto(GetListProfilesQuerySchema) { }

// DTOs for response documentation
export class CreateProfileResDto extends createZodDto(CreateProfileResSchema) { }
export class GetProfileResDto extends createZodDto(GetProfileResSchema) { }
export class GetListProfilesResDto extends createZodDto(GetListProfilesResSchema) { }
export class MessageResDto extends createZodDto(MessageResSchema) { }
