import { Request, Response } from 'express';
import {
    getCurrentMatchingUsersCount,
} from '../model/matching-model';

export async function getMatchingUsersCount(req: Request, res: Response) {
    try {
        const count = getCurrentMatchingUsersCount();
        return res.status(200).json({ count });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Unknown error when retrieving matching users count' });
    }
}

