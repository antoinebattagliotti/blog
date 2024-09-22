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
app.get('/', async (c) => {
    const activities = await getActivities()

    const distanceSum = activities.reduce((acc, activity) => {
        return typeof activity.distance === 'string'
            ? acc
            : acc + activity.distance
    }, 0)

    const currentTime = new Date().getTime()
    const utmbTime = new Date(2027, 8, 1, 0, 0, 0, 0).getTime()

    const secondsUntilUTMB = Math.abs((currentTime - utmbTime) / 1000)

    return c.html(
        <Layout>
            <div class={'flex flex-col items-center'}>
                <p>
                    Welcome to my personal portfolio, or as I like to call it,
                    the work in progress page... I have run{' '}
                    {distanceSum.toFixed(2)}.
                </p>

                <p>
                    I am planning to run UTMB in 2027, I still have{' '}
                    {secondsUntilUTMB.toFixed(0)} seconds of trainning.
                </p>
            </div>
        </Layout>
    )
})

// Use case route
app.get('/use-case', async (c) => {
    try {
        return c.html(
            <Layout>
                <div class={'flex items-center'}>My use case</div>
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
                <div class={'flex items-center'}>My inspiration case</div>
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
                <div class={'w-full'}>
                    {activities.map((activity) => {
                        const distanceParsed = z.coerce
                            .number()
                            .safeParse(activity.distance)

                        const distanceInKm = distanceParsed.success
                            ? (distanceParsed.data / 1000).toFixed(2)
                            : activity.distance

                        return (
                            <a
                                class={
                                    'cursor-pointer py-[0.375rem] uppercase italic text-gray-900 transition duration-200 ease-in-out hover:text-gray-500'
                                }
                            >
                                <div
                                    class={
                                        'grid grid-cols-[repeat(24,1fr)] place-items-start gap-[0.5rem] pt-[0.75rem] tracking-[0.2px]'
                                    }
                                >
                                    <div
                                        class={
                                            'col-span-8 text-[12px] font-[500] leading-[12px]'
                                        }
                                    >
                                        {activity.name}
                                    </div>
                                    <div
                                        class={
                                            'col-span-6 text-[10px] font-[400] leading-[10px]'
                                        }
                                    >
                                        {activity.sport_type}
                                    </div>
                                    <div
                                        class={
                                            'col-span-4 place-self-end text-[10px] font-[400] leading-[10px]'
                                        }
                                    >
                                        {distanceInKm}
                                        <span class={'text-[6px]'}>km</span>
                                    </div>
                                    <div
                                        class={
                                            'col-span-4 place-self-end text-[10px] font-[400] leading-[10px]'
                                        }
                                    >
                                        {activity.total_elevation_gain}
                                        <span class={'text-[6px]'}>m</span>
                                    </div>
                                    <div
                                        class={
                                            'col-span-2 place-self-end text-[10px] font-[400] leading-[10px]'
                                        }
                                    >
                                        {new Date(
                                            activity.start_date
                                        ).toLocaleDateString('default', {
                                            month: 'short',
                                            year: '2-digit',
                                        })}
                                    </div>
                                </div>
                            </a>
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
