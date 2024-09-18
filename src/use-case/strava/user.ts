// TODO Improve the auth
import { z } from 'zod'
import { ActivityStravaSchema, ActivityStravaType } from '@/schema/strava'
import { getAccessToken } from '@/use-case/strava/auth'
import { redisClient } from '@/lib/redis'
import { STRAVA_ACTIVITIES_KEY } from '@/constants/cache'

export async function getActivities(): Promise<ActivityStravaType[]> {
    const cachedActivities = await redisClient.get(STRAVA_ACTIVITIES_KEY)

    if (cachedActivities)
        return JSON.parse(cachedActivities) as ActivityStravaType[]

    // Get a token
    const token = await getAccessToken()

    // Set up the url
    const url = new URL(`${Bun.env.STRAVA_BASE_URL}/athlete/activities`)
    url.searchParams.append('after', Bun.env.STRAVA_AFTER.toString())

    // Call Strava API to get the activities of the user
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    // Check the status of the response
    if (!response.ok) throw new Error('Failed to get activities from Strava')

    // Get the JSON response
    const json = await response.json()

    // Validate the JSON response against our schema
    const parsedJson = z.array(ActivityStravaSchema).safeParse(json)

    if (!parsedJson.success) {
        console.error(parsedJson.error.message)

        throw new Error('Failed to parse JSON response from Strava activities')
    }

    const activities = parsedJson.data.sort(
        (a, b) => b.start_date.getTime() - a.start_date.getTime()
    )

    await redisClient.set(STRAVA_ACTIVITIES_KEY, JSON.stringify(activities), {
        EX: 60 * 60,
    })

    // Return the activities sorted by start date desc
    return activities
}

// TODO Explain sort function in TS
