// Define the schema as an object with all the env variables and their types
import { z } from 'zod'

export const envSchema = z.object({
    PORT: z.coerce.number().int().positive(),
    ENV: z.union([
        z.literal('development'),
        z.literal('staging'),
        z.literal('production'),
    ]),
    STRAVA_AUTH_URL: z.string().url(),
    STRAVA_BASE_URL: z.string().url(),
    STRAVA_CLIENT_ID: z.coerce.number(),
    STRAVA_CLIENT_SECRET: z.string(),
    STRAVA_CLIENT_CODE: z.string(),
    STRAVA_AFTER: z.coerce.number(),
})

export type EnvType = z.infer<typeof envSchema>
