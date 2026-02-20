import { z } from 'zod'

// ============================================
// LIKE SCHEMAS
// ============================================
export const LikeSchema = z.object({
    id: z.uuid(),
    senderId: z.uuid(),
    receiverId: z.uuid(),
    createdAt: z.iso.datetime(),
})

// ============================================
// CREATE LIKE
// ============================================
export const CreateLikeSchema = z.object({
    senderId: z.uuid('Invalid user ID'),
    receiverId: z.uuid('Invalid target user ID'),
})

export const CreateLikeResSchema = z.object({
    item: LikeSchema,
    isMatch: z.boolean(),
    matchId: z.uuid().optional(),
})

// ============================================
// GET LIKES
// ============================================
export const GetLikesQuerySchema = z.object({
    userId: z.uuid(),
    type: z.enum(['sent', 'received']).default('sent'),
})

export const GetLikesResSchema = z.object({
    items: z.array(LikeSchema),
    totalItems: z.number(),
})

// ============================================
// TYPE EXPORTS
// ============================================
export type LikeType = z.infer<typeof LikeSchema>
export type CreateLikeType = z.infer<typeof CreateLikeSchema>
export type GetLikesQueryType = z.infer<typeof GetLikesQuerySchema>
export type CreateLikeResType = z.infer<typeof CreateLikeResSchema>
export type GetLikesResType = z.infer<typeof GetLikesResSchema>
