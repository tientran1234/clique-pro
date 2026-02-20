import { createZodDto } from 'nestjs-zod'
import {
    GetMatchesQuerySchema,
    GetMatchesResSchema,
    IdParamSchema,
    GetMatchResSchema,
} from './matches.model'

// ============================================
// DTOs
// ============================================
export class GetMatchesQueryDto extends createZodDto(GetMatchesQuerySchema) { }
export class GetMatchesResDto extends createZodDto(GetMatchesResSchema) { }
export class IdParamDto extends createZodDto(IdParamSchema) { }
export class GetMatchResDto extends createZodDto(GetMatchResSchema) { }
