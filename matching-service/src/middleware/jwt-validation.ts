import dotenv from 'dotenv';
import e, { Request, Response, NextFunction } from 'express';
import { Socket } from 'socket.io';
import axios from 'axios';

dotenv.config();

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8004';

// Function to validate JWT in HTTP requests
export async function validateApiJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        // Call the API to verify the token
        console.log('Validating user via JWT');
        const response = await axios.get(`${USER_SERVICE_URL}/auth/verify-token`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        req.body.userId = response.data.id; // Assuming userId is returned in the response
        next();
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                return res.status(401).json({ message: 'Access Denied. Invalid token.' });
            }
            return res.status(500).json({ message: 'JWT verification service error.' });
        } else {
            console.error('Unexpected error:', err);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }
}

// Function to validate JWT in socket connections
export async function validateSocketJWT(socket: Socket, next: (err?: Error) => void) {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: No token provided.'));
    }

    try {
        // Call the API to verify the token
        console.log('Validating user via JWT');
        const response = await axios.get(`${USER_SERVICE_URL}/auth/verify-token`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(`User ${response.data.data.id} validated`);
        socket.data.userId = response.data.data.id; // Assuming userId is returned in the response
        next();
    } catch (err) {
        if (axios.isAxiosError(err)) {
            if (err.response?.status === 401) {
                console.log('Invalid token');
                next(new Error('Authentication error: Invalid token.'));
            } else {
                console.error('JWT verification service error:', err.message);
                next(new Error('Authentication error: JWT verification service error.'));
            }
        } else {
            console.error('Unexpected error:', err);
            next(new Error('Internal Server Error'));
        }
    }
}
