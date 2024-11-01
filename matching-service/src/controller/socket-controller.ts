import { Server, Socket } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { addUserToSearchPool, getSearchPoolStatus, getSocketIdForUser, isUserInSearchPool, matchOrAddUserToSearchPool, removeUserFromSearchPool } from "../model/matching-model";
import { getRedisClient } from '../utils/redis-client';
import { formatSearchPoolStatus, writeLogToFile } from "../utils/logger";
import dotenv from 'dotenv';

// IMPT NOTE: LOGGING OF QUEUE STATUS IS FOR DEMONSTRATION PURPOSES ONLY. IT LAGS THE SERVER AND SHOULD BE REMOVED IN PRODUCTION
// Search for writeLogToFile(formatSearchPoolStatus(await getSearchPoolStatus())); to remove

// if matching timeout is not valid use 30 seconds
// need to convert env variable to int. if conversion fails, use 30000

dotenv.config();

const MATCHING_TIMEOUT = (() => {
    const timeout = parseInt(process.env.MATCHING_TIMEOUT || '30000');
    // If the result is NaN, we use the default 30000 (30 seconds)
    return isNaN(timeout) ? 30000 : timeout;
})();

const userTimeouts: { [key: string]: NodeJS.Timeout } = {};

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
                const socket1: any = (await io.in(socketId1).fetchSockets())[0];
                const socket2: any = (await io.in(socketId2).fetchSockets())[0];

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

                    io.to(socketId1).emit('matchFound', { matchedWith: status[1].userId });
                    io.to(socketId2).emit('matchFound', { matchedWith: status[0].userId });

                    writeLogToFile(formatSearchPoolStatus(await getSearchPoolStatus()));

                    await initializeMatch(status[0], status[1], socket1, socket2);

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

async function initializeMatch(user1Data: any, user2Data: any, socket1: Socket, socket2: Socket) {
    try {
        // Get overlapping criteria for selecting a question
        const overlappingCriteria = getOverlappingCriteria(user1Data.criteria, user2Data.criteria);
        let selectedQuestionId;

        try {
            selectedQuestionId = await selectQuestion(overlappingCriteria);
        } catch (error) {
            console.error("Failed to select question:", error);
            socket1.emit('error', { message: "Failed to select question based on criteria." });
            socket2.emit('error', { message: "Failed to select question based on criteria." });
            return; // Exit function if question selection fails
        }

        let sessionId;
        try {
            // Initialize match on session service
            sessionId = await initializeMatchOnSessionService(user1Data.userId, user2Data.userId, selectedQuestionId);
            console.log(`Selected question for match ${sessionId}: ${selectedQuestionId}`);
        } catch (error: any) {
            console.error("Failed to initialize session on session service:", error);
            console.error("error message", error.message);
            socket1.emit('error', { message: "Failed to initialize session." });
            socket2.emit('error', { message: "Failed to initialize session." });
            return; // Exit function if session initialization fails
        }

        try {
            // Add match to user data for each user
            await addMatchToUserData(user1Data.userId, socket1.handshake.auth.token, user2Data.userId, selectedQuestionId, sessionId);
            await addMatchToUserData(user2Data.userId, socket2.handshake.auth.token, user1Data.userId, selectedQuestionId, sessionId);
        } catch (error) {
            console.error("Failed to add match to user data:", error);
        }

        // Redirect users to session page on success
        socket1.emit('redirectToSession', { matchedWith: user2Data.userId, question: selectedQuestionId });
        socket2.emit('redirectToSession', { matchedWith: user1Data.userId, question: selectedQuestionId });

        writeLogToFile(`Match initialized between ${user1Data.userId} and ${user2Data.userId}`);
    } catch (error) {
        // General catch for any unexpected errors
        console.error("Unexpected error during match initialization:", error);
        socket1.emit('error', { message: "An unexpected error occurred during match initialization." });
        socket2.emit('error', { message: "An unexpected error occurred during match initialization." });
    }
}


function getOverlappingCriteria(criteria1: any, criteria2: any) {
    const user1diff = criteria1.difficulty;
    const user1topic = criteria1.topic;
    const user2diff = criteria2.difficulty;
    const user2topic = criteria2.topic;

    const overlappingDiff = user1diff.filter((value: string) => user2diff.includes(value));
    const overlappingTopic = user1topic.filter((value: string) => user2topic.includes(value));

    return { difficulty: overlappingDiff, category: overlappingTopic };
}

async function selectQuestion(criteria: any) {

    const questionServiceUrl = process.env.QUESTION_SERVICE_URL;

    try {
        // Select question based on criteria
        const response = await fetch(`${questionServiceUrl}/api/questions/question/by-criteria`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(criteria)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const questionData = await response.json();
        return questionData.question.question_id;

    } catch (error) {
        console.error('Failed to select question:', error);
        throw error;
    }
}

async function addMatchToUserData(userId: string, userToken: string, partnerId: string, questionId: number, sessionId: string) {
    // Add match to user data
    // TODO: modify user service first
    try {
        const response = await fetch(`${process.env.USER_SERVICE_URL}/users/${userId}/addMatch`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${userToken}`
            },
            body: JSON.stringify({
                partnerId: partnerId,
                questionId: questionId,
                sessionId: sessionId
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        console.log(`Match added to user data for user ${userId}`);

    } catch (error) {
        console.error('Failed to add match to user data:', error);
        throw error;
    }
}

async function initializeMatchOnSessionService(userId1: string, userId2: string, questionId: number): Promise<string> {
    // Initialize match on session service
    const sessionServiceUrl = process.env.COLLAB_SERVICE_URL;
    const COLLAB_API_KEY = process.env.COLLAB_API_KEY || "collab-api-key";

    console.log(`Initializing match on session service with users ${userId1} and ${userId2} for question ${questionId}`);
    console.log("API KEY", COLLAB_API_KEY);

    try {
        const response = await fetch(`${sessionServiceUrl}/api/session/create`, {
            method: 'POST', // Using POST method to create a session
            headers: {
                'Content-Type': 'application/json', // Set the content type to JSON
                'x-api-key': COLLAB_API_KEY // Include the API key in the headers
            },
            body: JSON.stringify({
                participants: [userId1, userId2], // Include user IDs in the request body
                questionId: questionId // Include the question ID
            })
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`); // Handle non-2xx responses
        }

        const sessionData = await response.json(); // Parse the JSON response
        const sessionId = sessionData.session_id; // Extract the session_id

        console.log(`Match initialized on session service with session ID: ${sessionId}`);

        return sessionId; // Return the session ID
    } catch (error: any) {
        console.error('Failed to initialize match on session service:', error, error.message);
        throw error; // Rethrow the error for further handling if needed
    }
}

