import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl = process.env.REDIS_URL;
const client = createClient({ url: redisUrl });

client.on('error', (err) => {
  console.error('Redis error:', err);
});

(async () => {
  try {
    await client.connect();
  } catch (err) {
    console.error('Failed to connect to Redis', err);
  }
})();

const getAsync = async (cacheKey: string) => {
  try {
    const cachedEvents = await client.get(cacheKey);
    return cachedEvents ? JSON.parse(cachedEvents) : null;
  } catch (err) {
    console.error('Error fetching from Redis cache', err);
    return null;
  }
};

const setAsync = async (cacheKey: string, events: string, expiryInSeconds: number) => {
  try {
    await client.set(cacheKey, JSON.stringify(events), {
      EX: expiryInSeconds, // Set the expiration time (in seconds)
    });
  } catch (err) {
    console.error('Error setting Redis cache', err);
  }
};

export { client, getAsync, setAsync };
