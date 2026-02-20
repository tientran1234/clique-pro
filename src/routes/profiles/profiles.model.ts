import { OrderBy, ProfileSortBy } from 'src/shared/constants/enums'
import { z } from 'zod'

// ============================================
// ENUMS
// ============================================
export enum Gender {
    MALE = 'male',
    FEMALE = 'female',
    OTHER = 'other',
}

// ============================================
// PROFILE SCHEMAS
// ============================================
export const ProfileSchema = z.object({
    id: z.uuid(),
    email: z.email(),
    name: z.string(),
    age: z.number().int(),
    gender: z.enum(Gender),
    bio: z.string(),
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
})

// ============================================
// CREATE PROFILE
// ============================================
export const CreateProfileSchema = z.object({
    email: z.email('Invalid email format'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name too long'),
    age: z.number().int().min(18, 'Must be at least 18 years old').max(100, 'Invalid age'),
    gender: z.enum(Gender),
    bio: z.string().min(10, 'Bio must be at least 10 characters').max(500, 'Bio too long'),
})

export const CreateProfileResSchema = z.object({
    item: ProfileSchema.omit({ updatedAt: true }),
})

// ============================================
// UPDATE PROFILE
// ============================================
export const UpdateProfileSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(2).max(50).optional(),
    age: z.number().int().min(18).max(100).optional(),
    gender: z.enum(Gender).optional(),
    bio: z.string().min(10).max(500).optional(),
})

// ============================================
// GET PROFILE
// ============================================
export const IdParamSchema = z.object({
    id: z.uuid(),
})

export const EmailParamSchema = z.object({
    email: z.email(),
})

export const GetProfileResSchema = z.object({
    item: ProfileSchema.nullable(),
})

// ============================================
// LIST PROFILES
// ============================================
export const GetListProfilesQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(10),
    search: z.string().optional(),
    gender: z.enum(Gender).optional(),
    minAge: z.coerce.number().int().positive().optional(),
    maxAge: z.coerce.number().int().positive().optional(),
    orderBy: z.enum(OrderBy).default(OrderBy.Desc),
    sortBy: z.enum(ProfileSortBy).default(ProfileSortBy.CreatedAt),
})

export const GetListProfilesResSchema = z.object({
    items: z.array(ProfileSchema.omit({ updatedAt: true })),
    totalItems: z.number(),
    page: z.number(),
    limit: z.number(),
    totalPages: z.number(),
    statsAll: z
        .object({
            male: z.number(),
            female: z.number(),
            other: z.number(),
        })
        .optional(),
})

// ============================================
// TYPE EXPORTS
// ============================================
export type ProfileType = z.infer<typeof ProfileSchema>
export type CreateProfileType = z.infer<typeof CreateProfileSchema>
export type UpdateProfileType = z.infer<typeof UpdateProfileSchema>
export type IdParamType = z.infer<typeof IdParamSchema>
export type EmailParamType = z.infer<typeof EmailParamSchema>
export type GetListProfilesQueryType = z.infer<typeof GetListProfilesQuerySchema>
export type GetProfileResType = z.infer<typeof GetProfileResSchema>
export type GetListProfilesResType = z.infer<typeof GetListProfilesResSchema>

