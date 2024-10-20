import { stringify } from 'querystring';
import { formatMatchedUsers, writeLogToFile } from '../utils/logger';
import { getRedisClient } from '../utils/redis-client';

export interface SearchCriteria {
    difficulty: string[];
    topic: string[];
}

interface UserSearch {
    userId: string;
    socketId: string;
    criteria: SearchCriteria;
    startTime: Date;
}

// Get time spent matching for a specific user
export async function getTimeSpentMatching(userId: string): Promise<number | null> {
    const redisClient = getRedisClient();
    const user = await redisClient.hGetAll(`user:${userId}`);
    if (!user.startTime) return null;

    const now = new Date();
    const startTime = new Date(user.startTime);
    const timeSpent = now.getTime() - startTime.getTime();
    return Math.floor(timeSpent / 1000); // Time in seconds
}

// Get the count of users currently matching
export async function getCurrentMatchingUsersCount(): Promise<number> {
    const redisClient = getRedisClient();
    return await redisClient.zCard('searchPool');  // Using ZSET size
}

// Perform the matching logic
export async function matchOrAddUserToSearchPool(userId: string, socketId: string, criteria: SearchCriteria) {
    const redisClient = getRedisClient();
    const topics = JSON.stringify(criteria.topic);
    const difficulties = JSON.stringify(criteria.difficulty);
    const startTime = Date.now().toString();

    // Call the Lua script for matching or adding to the search pool
    const result = await redisClient.matchOrAddUser(topics, difficulties, userId, socketId, startTime);

    if (result) {
        const match = result;
        writeLogToFile(formatMatchedUsers(result));
        return match.matchedUsers;
    } else {
        writeLogToFile(`User ${userId} added to search pool`);
        return null;
    }
}

// Get socket ID for a user
export async function getSocketIdForUser(userId: string): Promise<string> {
    const redisClient = getRedisClient();
    const user = await redisClient.hGetAll(`user:${userId}`);
    return user.socketId;
}

// Check if a user is in the search pool
export async function isUserInSearchPool(userId: string): Promise<boolean> {
    const redisClient = getRedisClient();
    const rank = await redisClient.zRank('searchPool', userId); // Check rank in ZSET
    return rank !== null; // User is in search pool if rank is not null
}

// Add user to the search pool
export async function addUserToSearchPool(userId: string, socketId: string, criteria: SearchCriteria) {
    const redisClient = getRedisClient();
    const startTime = new Date().toISOString();
    await redisClient.hSet(`user:${userId}`, {
        socketId,
        criteria: JSON.stringify(criteria),
        startTime
    });
    await redisClient.zAdd('searchPool', { score: Date.now(), value: userId }); // Add user to ZSET with startTime as score
    writeLogToFile(`User ${userId} added to search pool`);
}

// Remove a user from the search pool
export async function removeUserFromSearchPool(userId: string): Promise<void> {
    const redisClient = getRedisClient();
    await redisClient.del(`user:${userId}`);
    await redisClient.zRem('searchPool', userId); // Remove user from ZSET
    writeLogToFile(`User ${userId} removed from search pool`);
}

export async function getSearchPoolStatus() {
    const redisClient = getRedisClient();

    // Retrieve all user IDs from the sorted set (ZSET), sorted by their startTime (score)
    const userIds: string[] = await redisClient.zRange('searchPool', 0, -1);

    const users = [];

    for (const userId of userIds) {
        const userData = await redisClient.hGetAll(`user:${userId}`);
        if (userData) {
            const criteria = JSON.parse(userData.criteria); // Parse criteria JSON
            const socketId = userData.socketId; // Accessing by key
            const startTime = userData.startTime; // Accessing by key

            users.push({
                userId,
                socketId,
                criteria,
                startTime
            });
        }
    }

    return { users };
}
