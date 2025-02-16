import { createClient } from 'redis';
import ENV from "./env.js";

const redisClient = createClient({
    url: ENV.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

export const connectRedis = async () => {
    try {
        await redisClient.connect();
        console.log('Connected to Redis');
    } catch (error) {
        console.error('Redis connection failed:', error);
    }
};

export { redisClient };