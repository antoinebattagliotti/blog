import { Hono } from 'hono'
import { serve } from 'bun'
import Layout from '@/layout'
import { envSchema, EnvType } from '@/schema/env'
import { getActivities } from '@/use-case/strava/user'

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
            <div class={'bg-slate-200 text-red-500'}>Hello</div>
        </Layout>
    )
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
                        return (
                            <div>
                                {activity.name} {activity.sport_type}
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
