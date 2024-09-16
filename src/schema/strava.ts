import { z } from 'zod'
import { SPORT_TYPES } from '@/constants/strava'

export const AuthStravaSchema = z.object({
    expires_at: z.number(),
    refresh_token: z.string(),
    access_token: z.string(),
})

// Get more precise sport type
export const ActivityStravaSchema = z.object({
    name: z.string(),
    distance: z.union([z.string(), z.number()]),
    total_elevation_gain: z.union([z.string(), z.number()]),
    sport_type: z.enum(SPORT_TYPES).catch('Other'),
    start_date: z.coerce.date(),
    kudos_count: z.number(),
})

export type ActivityStravaType = z.infer<typeof ActivityStravaSchema>
