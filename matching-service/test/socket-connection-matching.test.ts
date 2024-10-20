// tests/socket.test.ts
import io, { Socket } from 'socket.io-client';
import { server } from '../src/server'; // Adjust path to server.ts
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 8002;
const JWT_SECRET = process.env.JWT_SECRET || 'my-secret';

// Comment out for docker testing
// beforeAll((done) => {
//     server.listen(PORT, done);
// });

// afterAll((done) => {
//     server.close(done);
// });

describe('Socket.IO Server Tests', () => {

    test('should register a user and get success response', (done) => {

        const clientSocket = io(`http://localhost:${PORT}`, {
            auth: { token: jwt.sign({ id: 'client-id' }, JWT_SECRET) },
        });
        clientSocket.emit('registerForMatching', { difficulty: 'easy', topic: 'math' });
        clientSocket.on('registrationSuccess', (message) => {
            expect(message.message).toBe('User client-id registered for matching successfully.');
            clientSocket.disconnect();
            done();
        });
    });

    test('should handle matching users and send matchFound event', (done) => {

        const clientSocket = io(`http://localhost:${PORT}`, {
            auth: { token: jwt.sign({ id: 'client-id' }, JWT_SECRET) },
        });

        const anotherSocket = io(`http://localhost:${PORT}`, {
            auth: { token: jwt.sign({ id: 'client-id2' }, JWT_SECRET)  },
        });


        anotherSocket.on('connect', () => {

            clientSocket.emit('registerForMatching', { difficulty: 'easy', topic: 'math' });

            anotherSocket.emit('registerForMatching', { difficulty: 'easy', topic: 'math' });

            anotherSocket.on('matchFound', (data) => {
                expect(data.matchedWith).toBe('client-id'); // Replace with actual expected value
                // add delay to allow for disconnect
                setTimeout(() => {
                    done();
                }, 4000);
            });

        });
    });

    // Comment out for docker testing
    // test('should handle user disconnection', (done) => {

    //     const clientSocket = io(`http://localhost:${PORT}`, {
    //         auth: { token: jwt.sign({ id: 'client-id' }, JWT_SECRET) },
    //     });

    //     clientSocket.on('connect', () => {
    //         clientSocket.disconnect();
    //         setTimeout(() => {
    //             redisClient.sCard('searchPool').then((count: number) => {
    //                 expect(count).toBe(0);
    //                 done();
    //             });
    //         }, 2000);
    //     });
    // });



});
