import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { validateSocketJWT } from './middleware/jwt-validation';
import {
    addUserToSearchPool,
    removeUserFromSearchPool,
    matchUsers
} from './model/matching-model';
import { inherits } from 'util';
import { registerEventHandlers } from './routes/socket-routes';
import { initaliseData } from './controller/socket-controller';

// Create the express app
const app = express();
const server = http.createServer(app);

// Initialize socket.io with the HTTP server
const io = new Server(server, {
    cors: {
        origin: '*', // Adjust this based on your allowed origins
    },
});

// Middleware for parsing JSON
app.use(express.json());

// Socket.io connection handler with JWT validation
io.use(validateSocketJWT);
io.on('connection', (socket) => {
    initaliseData(socket);
    registerEventHandlers(socket, io);
})

export { server };

if (require.main === module) {
    // Start the server
    const PORT = 8002;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}