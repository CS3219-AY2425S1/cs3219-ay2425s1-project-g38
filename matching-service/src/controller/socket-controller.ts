import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { addUserToSearchPool, getSearchPoolStatus, getSocketIdForUser, isUserInSearchPool, matchOrAddUserToSearchPool, removeUserFromSearchPool } from "../model/matching-model";
import { getRedisClient } from '../utils/redis-client';
import { formatSearchPoolStatus, writeLogToFile } from "../utils/logger";

// IMPT NOTE: LOGGING OF QUEUE STATUS IS FOR DEMONSTRATION PURPOSES ONLY. IT LAGS THE SERVER AND SHOULD BE REMOVED IN PRODUCTION
// Search for writeLogToFile(formatSearchPoolStatus(await getSearchPoolStatus())); to remove

// if matching timeout is not valid use 30 seconds
// need to convert env variable to int. if conversion fails, use 30000
const MATCHING_TIMEOUT = (() => {
    const timeout = parseInt(process.env.MATCHING_TIMEOUT || '30000');
    // If the result is NaN, we use the default 30000 (30 seconds)
    return isNaN(timeout) ? 30000 : timeout;
})();

const userTimeouts: { [key: string]: NodeJS.Timeout } = {};

// Initialize Redis adapter for socket.io
export function initializeSocketIO(io: Server) {
    const redisClient = getRedisClient();
    const pubClient = redisClient.duplicate();
    const subClient = redisClient.duplicate();
    io.adapter(createAdapter(pubClient, subClient));
    // allows for multiple instances of the server to communicate with each other
}

// Handle user registration for matching
// TODO: Consider race conditions and locking mechanisms
export function handleRegisterForMatching(socket: Socket, io: Server) {
    const { userId } = socket.data;
    socket.on('registerForMatching', async (criteria) => {

        if (await isUserInSearchPool(userId)) {
            socket.emit('error', 'User is already registered for matching.');
            socket.disconnect(true);
            return;
        }

        if (criteria.difficulty && criteria.topic && Array.isArray(criteria.difficulty) && Array.isArray(criteria.topic)) {

            writeLogToFile(`User ${userId} registered for matching with criteria (Topic: ${criteria.topic}, Difficulty: ${criteria.difficulty})`);

            const timeout = setTimeout(async () => {
                writeLogToFile(`User ${userId} timed out for matching`);
                await removeUserFromSearchPool(userId);
                writeLogToFile(formatSearchPoolStatus(await getSearchPoolStatus()));
                socket.emit('matchingTimeout');
            }, MATCHING_TIMEOUT);

            userTimeouts[socket.id] = timeout;

            const status = await matchOrAddUserToSearchPool(userId, socket.id, criteria);
            if (status) {
                const socketId1 = status[0].socketId;
                const socketId2 = status[1].socketId;

                // check if both users are still connected
                const socket1 = io.sockets.sockets.get(socketId1);
                const socket2 = io.sockets.sockets.get(socketId2);

                if (socket1 && socket2) {

                    // Clear timeouts
                    if (userTimeouts[socketId1]) {
                        clearTimeout(userTimeouts[socketId1]);
                        delete userTimeouts[socketId1];
                    }

                    if (userTimeouts[socketId2]) {
                        clearTimeout(userTimeouts[socketId2]);
                        delete userTimeouts[socketId2];
                    }

                    io.to(socketId1).emit('matchFound', { matchedWith: status[1].userId }); //INSERT SESSION ID HERE
                    io.to(socketId2).emit('matchFound', { matchedWith: status[0].userId }); //INSERT SESSION ID HERE

                    writeLogToFile(formatSearchPoolStatus(await getSearchPoolStatus()));

                    //Disconnect both users
                    socket1.disconnect(true);
                    socket2.disconnect(true);
                } else {
                    // Handle case where user disconnected on matching (Add other user back to search pool)
                    if (socket1 && !socket2) {
                        addUserToSearchPool(status[1].userId, status[1].socketId, status[1].criteria);
                    }
                    if (socket2 && !socket1) {
                        addUserToSearchPool(status[0].userId, status[0].socketId, status[0].criteria);
                    }
                }
            } else {
                socket.emit('registrationSuccess', { message: `User ${userId} registered for matching successfully.` });
                writeLogToFile(formatSearchPoolStatus(await getSearchPoolStatus()));
            }

        } else {
            socket.emit('error', 'Invalid matching criteria.');
        }
    });
}

export function handleDeregisterForMatching(socket: Socket) {
    socket.on('deregisterForMatching', async () => {
        writeLogToFile(`User ${socket.data.userId} deregistered for matching`);
        await removeUserFromSearchPool(socket.data.userId);
        writeLogToFile(formatSearchPoolStatus(await getSearchPoolStatus()));
        // Clear timeout
        if (userTimeouts[socket.id]) {
            clearTimeout(userTimeouts[socket.id]);
            delete userTimeouts[socket.id];
        }

    });
}

export function handleDisconnect(socket: Socket) {
    // Handle disconnection
    const { userId } = socket.data;
    socket.on('disconnect', async () => {
        writeLogToFile(`User ${userId} disconnected`);

        // Remove user from search pool only if socketID matches (to prevent duplicate connections from removing users)
        const userData = await getSocketIdForUser(userId);
        if (userData === socket.id) {
            await removeUserFromSearchPool(userId);
            writeLogToFile(formatSearchPoolStatus(await getSearchPoolStatus()));
            if (userTimeouts[socket.id]) {
                clearTimeout(userTimeouts[socket.id]);
                delete userTimeouts[socket.id];
            }
        }
        // Clear timeout

    });
}
