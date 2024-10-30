import { Server, Socket } from "socket.io";
import Session from '../model/session-model';
import * as Y from 'yjs';
import { addConnectedUser, addUpdateToYDocInRedis, deleteLanguageFromRedis, deleteYDocFromRedis, getLanguageFromRedis, getYDocFromRedis, isUserConnected, removeConnectedUser, setLanguageInRedis } from "../utils/redis-helper";

const userSocketMap: { [key: string]: string } = {};
const sessionDocMap: { [key: string]: Y.Doc } = {};

export async function initialize(socket: Socket, io: Server) {

    const { userId } = socket.data;

    const userConnected = await isUserConnected(userId);

    if (userConnected) {
        console.log('User already connected:', userId);
        socket.emit('error', 'User already connected');
        socket.disconnect(true);
        return;
    }

    // Store userID to redis
    await addConnectedUser(userId);
    userSocketMap[userId] = socket.id;

    try {
        // Find the session that the user is part of
        const session = await Session.findOne({
            activeUsers: { $in: [userId] }, // Check if userId is in participants array
            active: true
        });

        if (!session) {
            console.error('No active session found for user', userId);
            socket.emit('error', 'No active session found');
            socket.disconnect(true);
            return;
        }

        const questionDescription = session.questionDescription;
        const questionTemplateCode = session.questionTemplateCode;
        const questionTestcases = session.questionTestcases;

        const yDoc = sessionDocMap[session.session_id];

        let yDocUpdate: Uint8Array;

        if (!yDoc) {
            console.warn(`YDoc not found for session ${session.session_id}. Retrieving from Redis`);
            const redisYDoc = await getYDocFromRedis(session.session_id);
            if (!redisYDoc) {
                console.warn('YDoc not found in Redis, initializing new YDoc from session data');
                const newYDoc = new Y.Doc();
                Y.applyUpdateV2(newYDoc, new Uint8Array(session.yDoc));
                addUpdateToYDocInRedis(session.session_id, Y.encodeStateAsUpdateV2(newYDoc));
                sessionDocMap[session.session_id] = newYDoc;
                yDocUpdate = Y.encodeStateAsUpdateV2(newYDoc);
            } else {
                sessionDocMap[session.session_id] = redisYDoc;
                yDocUpdate = Y.encodeStateAsUpdateV2(redisYDoc);
            }
        } else {
            yDocUpdate = Y.encodeStateAsUpdateV2(yDoc);
        }

        const selectedLanguage = await getLanguageFromRedis(session.session_id) || 'javascript';

        const roomId = session.session_id; // Use session ID as room ID

        // Join the socket to the room
        socket.join(roomId);

        // Store the room ID in the socket
        socket.data.roomId = roomId;

        // Get all sockets in the room
        const roomSockets = await io.in(session.session_id).fetchSockets();
        const usersInRoom = roomSockets.map((socket) => socket.data.username);

        console.log(`User ${userId} joined session ${roomId}`);

        // Emit initial data to the user after they join the room
        socket.emit('initialData', {
            message: 'You have joined the session!',
            sessionData: {
                questionDescription,
                questionTemplateCode,
                questionTestcases,
                yDocUpdate,
                selectedLanguage,
                usersInRoom
            },
        });

        // Notify others in the room
        socket.to(roomId).emit('userJoined', { usersInRoom });

    } catch (err) {
        console.error('Error finding session:', err);
        socket.emit('error', 'An error occurred while finding the session');
        socket.disconnect(true);
    }
}

export function handleUpdateContent(socket: Socket, io: Server) {
    socket.on('update', (update) => {
        // console.log('Received update:', update);
        const yDocUpdate = update;
        const roomId = socket.data.roomId

        socket.to(roomId).emit('updateContent', yDocUpdate);

        // Add Update to YDoc in Redis
        addUpdateToYDocInRedis(roomId, yDocUpdate);
    });
}

export function handleSelectLanguage(socket: Socket, io: Server) {
    socket.on('selectLanguage', (language) => {
        const roomId = socket.data.roomId;
        socket.to(roomId).emit('updateLanguage', language);
        // Store language in Redis
        setLanguageInRedis(roomId, language);
    });
}

export function handleCodeExecution(socket: Socket, io: Server) {
    socket.on('codeExecution', (result) => {
        // console.log('Code execution result:', result);
        const roomId = socket.data.roomId;
        socket.to(roomId).emit('updateOutput', result);
    });
}

export function handleTermination(socket: Socket, io: Server) {
    socket.on('changeModalVisibility', (isVisible) => {
        console.log('Modal visibility changed:', isVisible);
        const roomId = socket.data.roomId;
        socket.to(roomId).emit('modalVisibility', isVisible);
    });

    socket.on('terminateOne', async () => {
        const roomId = socket.data.roomId;
        socket.to(roomId).emit('terminateOne');
    });

    socket.on('terminateSession', async () => {
        console.log('Session terminated');
        const roomId = socket.data.roomId;
        socket.to(roomId).emit('terminateSession');
    });
}

export async function handleDisconnect(socket: Socket, io: Server) {
    socket.on('disconnect', async () => {

        console.log('user disconnected');
        const roomId = socket.data.roomId;
        if (roomId) {
            const roomSockets = io.sockets.adapter.rooms.get(roomId);
            if (!roomSockets || roomSockets.size === 0) {
                // If no sockets left, mark the session as inactive
                console.log(`Room ${roomId} is empty. Marking session as inactive`);

                // Get the YDoc from redis
                const yDoc = await getYDocFromRedis(roomId);

                if (yDoc) {
                    Session.findOneAndUpdate(
                        { session_id: roomId },
                        { active: false, yDoc: Buffer.from(Y.encodeStateAsUpdateV2(yDoc)) }
                    )
                        .then((doc) => {
                            if (!doc) {
                                console.error('No session found with that id.');
                            }
                        })
                        .catch((err) => {
                            console.error('Error updating session:', err);
                        });
                } else {
                    console.error(`YDoc not found for session ${roomId}. Cannot update session.`);
                }

                // Delete the YDoc from Redis
                deleteYDocFromRedis(roomId);
                deleteLanguageFromRedis(roomId);

            } else {
                const roomSockets = await io.in(roomId).fetchSockets();
                const usersInRoom = roomSockets.map((socket) => socket.data.username);
                socket.to(roomId).emit('userLeft', { usersInRoom });
            }
        }

        // Check if socket was registered
        if (userSocketMap[socket.data.userId] === socket.id) {
            // Remove user from Redis and delete the socket mapping
            delete userSocketMap[socket.data.userId];
            await removeConnectedUser(socket.data.userId);
        }
    });
}
