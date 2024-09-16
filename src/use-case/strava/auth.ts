// TODO Return access token
import { AuthStravaSchema } from '@/schema/strava'
import { redisClient } from '@/lib/redis'
import {
    STRAVA_ACCESS_TOKEN_KEY,
    STRAVA_EXPIRES_AT_KEY,
    STRAVA_REFRESH_TOKEN_KEY,
    STRAVA_TTL_KEY,
} from '@/constants/cache'

async function processJsonResponse({ json }: { json: any }): Promise<string> {
    // Validate json against our schema
    const parsedJson = AuthStravaSchema.safeParse(json)

    if (!parsedJson.success)
        throw new Error('Failed to parse JSON response from Strava auth')

    const {
        data: { access_token, refresh_token, expires_at },
    } = parsedJson

    // Add to cache, 6 hours for access token and 24 hours for others
    await redisClient.set(STRAVA_ACCESS_TOKEN_KEY, access_token, {
        EX: STRAVA_TTL_KEY,
    })

    await redisClient.set(STRAVA_REFRESH_TOKEN_KEY, refresh_token, {
        EX: 86400,
    })

    await redisClient.set(STRAVA_EXPIRES_AT_KEY, expires_at, {
        EX: 86400,
    })

    return access_token
}

async function getAccessTokenFromClientCode(): Promise<string> {
    // Build the URL to auth to Strava
    const url = new URL(Bun.env.STRAVA_AUTH_URL)
    url.searchParams.append('client_id', Bun.env.STRAVA_CLIENT_ID.toString())
    url.searchParams.append('client_secret', Bun.env.STRAVA_CLIENT_SECRET)
    url.searchParams.append('code', Bun.env.STRAVA_CLIENT_CODE) // Only valid one time
    url.searchParams.append('grant_type', 'authorization_code')

    const response = await fetch(url, {
        method: 'POST',
    })

    if (!response.ok) {
        throw new Error('Failed to get access token from client code')
    }

    // Get the JSON
    const json = await response.json()

    // Process the JSON response
    return await processJsonResponse({ json })
}

async function getAccessTokenFromRefreshToken(): Promise<string> {
    // Build the URL to auth to Strava
    const url = new URL(Bun.env.STRAVA_AUTH_URL)
    url.searchParams.append('client_id', Bun.env.STRAVA_CLIENT_ID.toString())
    url.searchParams.append('client_secret', Bun.env.STRAVA_CLIENT_SECRET)
    url.searchParams.append('grant_type', 'refresh_token')
    url.searchParams.append('refresh_token', 'ReplaceWithRefreshToken')
    url.searchParams.append('refresh_token', 'todo')

    const response = await fetch(url, {
        method: 'POST',
        redirect: 'follow',
    })

    if (!response.ok)
        throw new Error('Failed to get access token from refresh token')

    // Get the JSON
    const json = await response.json()

    // Process the JSON response
    return await processJsonResponse({ json })
}

export async function getAccessToken(): Promise<string> {
    // Get the expires at key from Redis
    const expiresAt = await redisClient.get(STRAVA_EXPIRES_AT_KEY)

    if (!expiresAt) {
        return await getAccessTokenFromClientCode()
    }

    // Get current time in EPOCH time, and compare it to expires at
    if (Number(expiresAt) >= Date.now()) {
        return await getAccessTokenFromRefreshToken()
    }

    const accessToken = await redisClient.get(STRAVA_ACCESS_TOKEN_KEY)

    if (!accessToken)
        throw new Error('Failed to get access token from Redis client')

    return accessToken
}
