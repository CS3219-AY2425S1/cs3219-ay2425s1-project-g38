import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { validateSocketJWT } from './middleware/jwt-validation';
import { getRedisClient, initializeRedisClient, pubClient, subClient } from './utils/redis-client';
import { registerEventHandlers } from './routes/socket-routes';
import dotenv from 'dotenv';
import { matchingRoutes } from './routes/api-routes';
import { createAdapter } from '@socket.io/redis-adapter';

dotenv.config();

// Create the express app
const app = express();
const server = http.createServer(app);

// Function to initialize Redis and start the server
async function startServer() {
    try {
        // Initialize Redis client
        console.log('Initializing Redis client...');
        await initializeRedisClient();

        // Start the server only after Redis client is initialized

        // Middleware for parsing JSON
        app.use(express.json());
        app.use('/api', matchingRoutes);


        const io = new Server(server, {
            cors: {
                origin: '*', // Adjust this based on your allowed origins
            },
            adapter: createAdapter(pubClient, subClient),
        });

        // Socket.io connection handler with JWT validation
        io.use(validateSocketJWT);
        io.on('connection', (socket) => {
            console.log(`User ${socket.data.userId} connected via socket ${socket.id}`);
            registerEventHandlers(socket, io);
        });

        const PORT = Number(process.env.MATCHING_SERVICE_PORT) || 8002;

        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (error) {
        console.error('Error initializing Redis client: ', error);
        process.exit(1); // Shut down the server if Redis initialization fails
    }
}

if (require.main === module) {
    // Call the startServer function to initialize Redis and start the server
    startServer();
}

export { server };
