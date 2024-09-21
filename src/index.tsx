import { Hono } from 'hono'
import { serve } from 'bun'
import Layout from '@/layout'
import { envSchema, EnvType } from '@/schema/env'
import { getActivities } from '@/use-case/strava/user'
import { z } from 'zod'

declare module 'bun' {
    interface Env extends EnvType {}
}

const app = new Hono()

// Validate process.env against our schema
envSchema.parse(Bun.env)

// Main route
app.get('/', (c) => {
    return c.html(
        <Layout>
            <div class={'flex items-center h-full'}>
                Welcome to my personal portfolio, or as I like to call it, the
                work in progress page...
            </div>
        </Layout>
    )
})

// Use case route
app.get('/use-case', async (c) => {
    try {
        return c.html(
            <Layout>
                <div>My use case</div>
            </Layout>
        )
    } catch (err) {
        if (err instanceof Error) console.log(err.message)

        c.status(400)

        return c.json({
            message: err instanceof Error ? err.message : 'An error occurred',
        })
    }
})

// Inspiration route
app.get('/inspiration', async (c) => {
    try {
        return c.html(
            <Layout>
                <div>My inspiration case</div>
            </Layout>
        )
    } catch (err) {
        if (err instanceof Error) console.log(err.message)

        c.status(400)

        return c.json({
            message: err instanceof Error ? err.message : 'An error occurred',
        })
    }
})

// Strava route
app.get('/strava', async (c) => {
    try {
        const activities = await getActivities()

        c.status(200)

        return c.html(
            <Layout>
                <div>
                    {activities.map((activity) => {
                        const distanceParsed = z.coerce
                            .number()
                            .safeParse(activity.distance)

                        const distanceInKm = distanceParsed.success
                            ? (distanceParsed.data / 1000).toFixed(2)
                            : activity.distance

                        return (
                            <div>
                                {activity.name} {activity.sport_type}{' '}
                                {distanceInKm}
                                <span class={'text-[7px]'}>km</span>
                            </div>
                        )
                    })}
                </div>
            </Layout>
        )

        // return c.json(activities)
    } catch (err) {
        if (err instanceof Error) console.log(err.message)

        c.status(400)

        return c.json({
            message: err instanceof Error ? err.message : 'An error occurred',
        })
    }
})

serve({
    port: Bun.env.PORT,
    fetch: app.fetch,
})

console.log('Bun server started on port', Bun.env.PORT)
