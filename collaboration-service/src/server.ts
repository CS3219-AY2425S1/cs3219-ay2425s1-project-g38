import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import { validateSocketJWT } from './middleware/jwt-validation';
import './utils/cron-jobs';
import router from './routes/session-routes';
import { initialize } from './controller/editor-controller';
import { registerEventHandlers } from './routes/editor-routes';
import { pubClient, subClient } from './utils/redis-helper';
import { createAdapter } from '@socket.io/redis-adapter';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/session", router)

mongoose
    .connect(process.env.COLLAB_MONGODB_URI as string, {})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('Error connecting to MongoDB', err));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'PUT', 'POST', 'DELETE'],
        credentials: true
    },
    adapter: createAdapter(pubClient, subClient)
});

io.use(validateSocketJWT);
io.on('connection', (socket) => {
    console.log(`User ${socket.data.userId} connected via socket ${socket.id}`);
    initialize(socket, io);
    registerEventHandlers(socket, io);
});

export { server };

if (require.main === module) {
    dotenv.config();
    const PORT = Number(process.env.COLLABORATION_SERVICE_PORT) || 8010;
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`Server listening on port ${PORT}`);
    });

}
