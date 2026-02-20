import { createZodDto } from 'nestjs-zod'
import {
    CreateAvailabilitySchema,
    CreateAvailabilityResSchema,
    GetAvailabilitiesQuerySchema,
    GetAvailabilitiesResSchema,
    IdParamSchema,
} from './availability.model'
import { MessageResSchema } from '../../shared/models/response.model'

// ============================================
// DTOs
// ============================================
export class CreateAvailabilityDto extends createZodDto(CreateAvailabilitySchema) { }
export class CreateAvailabilityResDto extends createZodDto(CreateAvailabilityResSchema) { }
export class GetAvailabilitiesQueryDto extends createZodDto(GetAvailabilitiesQuerySchema) { }
export class GetAvailabilitiesResDto extends createZodDto(GetAvailabilitiesResSchema) { }
export class IdParamDto extends createZodDto(IdParamSchema) { }
export class MessageResDto extends createZodDto(MessageResSchema) { }
