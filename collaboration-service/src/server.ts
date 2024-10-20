import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import { validateSocketJWT } from './middleware/jwt-validation';
import { handleEdits } from './routes/socket-routes';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    }
});

//io.use(validateSocketJWT);

handleEdits(io);

export { server };

if (require.main === module) {
    dotenv.config();
    const PORT = 8001;
    server.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });

}