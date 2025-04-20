import 'dotenv/config';
import { RedisClientType, createClient } from 'redis';

export class RedisInstance {
    private static instance: RedisInstance;
    private static CacheClient: RedisClientType;

    private constructor() {
        console.warn('🔺 New Redis Client Instance Created!!');
        this.initialize();
    }

    private initialize() {
        if (!process.env.REDIS_URL) {
            console.error('🚫 REDIS_URL is not set in .env!');
            throw new Error('Missing REDIS_URL');
        }

        RedisInstance.CacheClient = createClient({
            url: process.env.REDIS_URL,
        });

        RedisInstance.CacheClient.on('error', (err) => {
            console.error('❌ Redis Client Error:', err);
        });

        RedisInstance.CacheClient.connect()
            .then(() => {
                console.log('✅ Connected to Redis!');
            })
            .catch((err) => {
                console.error('❌ Could not connect to Redis', err);
                throw err;
            });
    }

    public static getInstance(): RedisInstance {
        if (!RedisInstance.instance) {
            RedisInstance.instance = new RedisInstance();
        }
        return RedisInstance.instance;
    }

    public getClient(): RedisClientType {
        if (!RedisInstance.CacheClient) {
            throw new Error('Redis client is not initialized');
        }
        return RedisInstance.CacheClient;
    }

    public async set(
        key: string,
        value: string,
        expiryInSeconds?: number,
    ): Promise<void> {
        try {
            if (expiryInSeconds) {
                await RedisInstance.CacheClient.set(key, value, {
                    EX: expiryInSeconds,
                });
            } else {
                await RedisInstance.CacheClient.set(key, value);
            }
        } catch (err) {
            console.error('❌ Error setting data in Redis:', err);
        }
    }

    public async get(key: string): Promise<string | null> {
        try {
            return await RedisInstance.CacheClient.get(key);
        } catch (err) {
            console.error('❌ Error getting data from Redis:', err);
            return null;
        }
    }

    public async del(key: string): Promise<void> {
        try {
            await RedisInstance.CacheClient.del(key);
            console.log(`✅ Key "${key}" deleted from Redis`);
        } catch (err) {
            console.error('❌ Error deleting data from Redis:', err);
        }
    }
}

const redis = RedisInstance.getInstance();
export default redis;
