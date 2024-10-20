import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Socket } from 'socket.io';

dotenv.config();
const secretKey = process.env.JWT_SECRET || 'my-secret';

// Function to validate JWT in HTTP requests
export function validateApiJWT(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token
    if (!token) {
        return res.status(401).json({ message: 'Access Denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        req.body.userId = decoded.id; // Attach userId to request
        next();
    } catch (err) {
        return res.status(400).json({ message: 'Invalid token.' });
    }
}

export function validateSocketJWT(socket: Socket, next: (err?: Error) => void) {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Authentication error: No token provided.'));
    }

    try {
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        socket.data.userId = decoded.id;
        if (!decoded.id) {
            throw new Error('Invalid token');
        }
        console.log(`User ${decoded.id} validated via JWT`);
        next();
    } catch (err) {
        next(new Error('Authentication error: Invalid token.'));
    }
}

export function validateJWT (token: string): JwtPayload {
    return jwt.verify(token, secretKey) as JwtPayload;
}