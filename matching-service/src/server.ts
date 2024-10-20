import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { validateSocketJWT } from './middleware/jwt-validation';
import { initializeRedisClient } from './utils/redis-client';
import { registerEventHandlers } from './routes/socket-routes';
import dotenv from 'dotenv';
import { matchingRoutes } from './routes/api-routes';

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

        // Initialize socket.io with the HTTP server
        const io = new Server(server, {
            cors: {
                origin: '*', // Adjust this based on your allowed origins
            },
        });

        // Socket.io connection handler with JWT validation
        io.use(validateSocketJWT);
        io.on('connection', (socket) => {
            console.log(`User ${socket.data.userId} connected via socket ${socket.id}`);
            registerEventHandlers(socket, io);
        });

        const PORT = process.env.PORT || 8002;
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
