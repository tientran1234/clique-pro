import { z } from 'zod'

// ============================================
// MATCH SCHEMAS
// ============================================
export const MatchSchema = z.object({
    id: z.uuid(),
    userAId: z.uuid(),
    userBId: z.uuid(),
    matchedAt: z.iso.date(),
    hasScheduledDate: z.boolean(),
    proposedDate: z.iso.datetime().nullable(),
    proposedTime: z.iso.datetime().nullable(),
})

// ============================================
// GET MATCHES
// ============================================
export const GetMatchesQuerySchema = z.object({
    userId: z.uuid(),
})

export const GetMatchesResSchema = z.object({
    items: z.array(MatchSchema),
    totalItems: z.number(),
})

// ============================================
// GET MATCH DETAIL
// ============================================
export const IdParamSchema = z.object({
    id: z.uuid(),
})

export const GetMatchResSchema = z.object({
    item: MatchSchema.nullable(),
})

// ============================================
// TYPE EXPORTS
// ============================================
export type MatchType = z.infer<typeof MatchSchema>
export type GetMatchesQueryType = z.infer<typeof GetMatchesQuerySchema>
export type IdParamType = z.infer<typeof IdParamSchema>
export type GetMatchResType = z.infer<typeof GetMatchResSchema>
export type GetMatchesResType = z.infer<typeof GetMatchesResSchema>
