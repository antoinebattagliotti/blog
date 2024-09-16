import { createClient } from 'redis'

const redisClient = createClient()

;(async () => {
    redisClient.on('error', (err) => console.log('Redis client error', err))

    redisClient.on('ready', () => console.log('Redis client started'))

    await redisClient.connect()

    await redisClient.ping()
})()

// Make sure we are connected to that Redis client that we have defined it
// Use an inline function, set to be async and add brackets to make sure the function runs immediately

export { redisClient }
