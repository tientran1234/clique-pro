import { z } from 'zod'

// ============================================
// AVAILABILITY SCHEMAS
// ============================================
export const AvailabilitySchema = z.object({
    id: z.uuid(),
    userId: z.uuid(),
    matchId: z.uuid().nullable(),
    date: z.iso.datetime(),
    startTime: z.string(), // "10:00"
    endTime: z.string(), // "12:00"
    createdAt: z.iso.datetime(),
    updatedAt: z.iso.datetime(),
})

// ============================================
// CREATE AVAILABILITY
// ============================================
export const CreateAvailabilitySchema = z.object({
    userId: z.uuid('Invalid user ID'),
    matchId: z.uuid('Invalid match ID'),
    slots: z.array(
        z.object({
            date: z.iso.datetime(),
            startTime: z.string(), // "10:00"
            endTime: z.string(), // "12:00"
        }),
    ).min(1, 'At least one time slot is required'),
})

export const CreateAvailabilityResSchema = z.object({
    items: z.array(AvailabilitySchema),
    commonSlot: z
        .object({
            date: z.iso.datetime(),
            startTime: z.string(),
            endTime: z.string(),
        })
        .nullable(),
    message: z.string(),
})

// ============================================
// GET AVAILABILITIES
// ============================================
export const GetAvailabilitiesQuerySchema = z.object({
    matchId: z.uuid(),
})

export const GetAvailabilitiesResSchema = z.object({
    items: z.array(AvailabilitySchema),
    totalItems: z.number(),
})

// ============================================
// DELETE AVAILABILITY
// ============================================
export const IdParamSchema = z.object({
    id: z.uuid(),
})

// ============================================
// TYPE EXPORTS
// ============================================
export type AvailabilityType = z.infer<typeof AvailabilitySchema>
export type CreateAvailabilityType = z.infer<typeof CreateAvailabilitySchema>
export type GetAvailabilitiesQueryType = z.infer<typeof GetAvailabilitiesQuerySchema>
export type CreateAvailabilityResType = z.infer<typeof CreateAvailabilityResSchema>
export type GetAvailabilitiesResType = z.infer<typeof GetAvailabilitiesResSchema>
export type IdParamType = z.infer<typeof IdParamSchema>
