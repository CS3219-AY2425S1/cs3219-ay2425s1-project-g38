import * as Y from 'yjs';
import Redis from 'ioredis';

// Initialize Redis client
const redisClient = new Redis(process.env.COLLAB_REDIS_URL || 'redis://localhost:6379');

export const pubClient = redisClient.duplicate();
export const subClient = redisClient.duplicate();

// Check if redis client is connected
redisClient.on('connect', () => {
    console.log('Connected to Redis');
    // // Delete all data in Redis on startup [for development only]
    // redisClient.flushall();
});

// Function to store document language in Redis
export async function setLanguageInRedis(sessionId: string, language: string) {
    try {
        if (!redisClient) {
            console.error('Redis client is not initialized');
            return;
        }

        await redisClient.set(`language:${sessionId}`, language);
        console.log(`Set language ${language} for session ${sessionId} in Redis`);
    } catch (err) {
        console.error(`Error setting language in Redis for session ${sessionId}:`, err);
    }
}

// Function to retrieve document language from Redis
export async function getLanguageFromRedis(sessionId: string): Promise<string | null> {
    try {
        if (!redisClient) {
            console.error('Redis client is not initialized');
            return null;
        }

        const language = await redisClient.get(`language:${sessionId}`);
        console.log(`Retrieved language ${language} for session ${sessionId} from Redis`);
        return language;
    } catch (err) {
        console.error(`Error retrieving language from Redis for session ${sessionId}:`, err);
        return null;
    }
}

// Function to delete document language from Redis
export async function deleteLanguageFromRedis(sessionId: string) {
    try {
        if (!redisClient) {
            console.error('Redis client is not initialized');
            return;
        }

        await redisClient.del(`language:${sessionId}`);
        console.log(`Deleted language for session ${sessionId} from Redis`);
    } catch (err) {
        console.error(`Error deleting language from Redis for session ${sessionId}:`, err);
    }
}

// Function to retrieve the Yjs document from Redis
export async function getYDocFromRedis(sessionId: string): Promise<Y.Doc | null> {
    try {
        // Retrieve the binary data from Redis
        if (!redisClient) {
            console.error('Redis client is not initialized');
            return null;
        }

        const yDocBuffer = await redisClient.lrangeBuffer(sessionId, 0, -1);

        if (yDocBuffer) {
            const yDoc = new Y.Doc();
            yDocBuffer.forEach((update) => {
                Y.applyUpdateV2(yDoc, new Uint8Array(update));
            });
            console.log(`Loaded YDoc for session ${sessionId} from Redis`);
            return yDoc;
        } else {
            console.warn(`No YDoc found in Redis for session ${sessionId}`);
            return null;
        }
    } catch (err) {
        console.error(`Error retrieving YDoc from Redis for session ${sessionId}:`, err);
        return null;
    }
}

export async function deleteYDocFromRedis(sessionId: string) {
    try {
        if (!redisClient) {
            console.error('Redis client is not initialized');
            return null;
        }

        await redisClient.del(sessionId);
        console.log(`Deleted YDoc for session ${sessionId} from Redis`);
    } catch (err) {
        console.error(`Error deleting YDoc from Redis for session ${sessionId}:`, err);
    }
}

export async function addUpdateToYDocInRedis(sessionId: string, yDocUpdate: Uint8Array) {
    try {
        if (!redisClient) {
            console.error('Redis client is not initialized');
            return null;
        }
        await redisClient.rpush(sessionId, Buffer.from(yDocUpdate));
    } catch (err) {
        console.error(`Error updating YDoc in Redis for session ${sessionId}:`, err);
    }
}

export async function addConnectedUser(userId: string) {
    try {
        if (!redisClient) {
            console.error('Redis client is not initialized');
            return null;
        }
        await redisClient.sadd('connectedUsers', userId);
        console.log(`Added user ${userId} to connected users in Redis`);
    } catch (err) {
        console.error(`Error adding user ${userId} to connected users in Redis:`, err);
    }
}

export async function removeConnectedUser(userId: string) {
    try {
        if (!redisClient) {
            console.error('Redis client is not initialized');
            return null;
        }
        await redisClient.srem('connectedUsers', userId);
        console.log(`Removed user ${userId} from connected users in Redis`);
    } catch (err) {
        console.error(`Error removing user ${userId} from connected users in Redis:`, err);
    }
}

export async function isUserConnected(userId: string) {
    try {
        if (!redisClient) {
            console.error('Redis client is not initialized');
            return false;
        }
        const result = await redisClient.sismember('connectedUsers', userId);
        return result === 1;
    } catch (err) {
        console.error(`Error checking if user ${userId} is connected in Redis:`, err);
        return false;
    }
}
