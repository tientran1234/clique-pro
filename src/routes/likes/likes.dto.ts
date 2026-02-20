import { createZodDto } from 'nestjs-zod'
import {
    CreateLikeSchema,
    CreateLikeResSchema,
    GetLikesQuerySchema,
    GetLikesResSchema,
} from './likes.model'

// ============================================
// DTOs
// ============================================
export class CreateLikeDto extends createZodDto(CreateLikeSchema) { }
export class CreateLikeResDto extends createZodDto(CreateLikeResSchema) { }
export class GetLikesQueryDto extends createZodDto(GetLikesQuerySchema) { }
export class GetLikesResDto extends createZodDto(GetLikesResSchema) { }
