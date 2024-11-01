import { createClient, defineScript } from 'redis';
import { Redis } from 'ioredis';
import * as fs from 'fs/promises';
import * as path from 'path';

interface CustomRedisClient extends ReturnType<typeof createClient> {
    matchOrAddUser: (topic: string, difficulty: string, userId: string, socketId: string, startTime: string) => Promise<any>;
}

const luaScriptPath = path.resolve(__dirname, './matchOrAddUser.lua');

// Singleton Redis client
export let redisClient: CustomRedisClient | null = null;

export async function initializeRedisClient() {
    const luaScriptContent = await fs.readFile(luaScriptPath, 'utf8');
    console.log('Connecting to Redis at ' + (process.env.REDIS_URL || 'redis://localhost:6379'));
    redisClient = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379',
        scripts: {
            // Define the Lua script
            matchOrAddUser: defineScript({
                NUMBER_OF_KEYS: 0,
                SCRIPT: luaScriptContent,
                // Transform the arguments passed to the script
                transformArguments(topic: string, difficulty: string, userId: string, socketId: string, startTime: string): Array<string> {
                    return [topic, difficulty, userId, socketId, startTime];
                },
                // Transform the reply from Redis
                transformReply(reply: string): any {
                    return reply ? JSON.parse(reply) : null;
                }
            })
        }
    });

    await redisClient.connect();
}

export function getRedisClient() {
    if (!redisClient) {
        throw new Error('Redis client is not initialized.');
    }
    return redisClient;
}

export const pubClient = new Redis( process.env.REDIS_URL || 'redis://localhost:6379');
export const subClient = pubClient.duplicate();
