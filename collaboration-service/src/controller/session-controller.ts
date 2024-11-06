import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Session from '../model/session-model';
import * as Y from 'yjs';
import { addUpdateToYDocInRedis, setLanguageInRedis } from '../utils/redis-helper';

export const sessionController = {
    createSession: async (req: Request, res: Response) => {
        const {
            participants, // pair of userIds
            questionId,
        } = req.body;

        console.log('session creation request:', req.body);

        if (!participants || !questionId) {
            return res.status(400).json({ message: 'Participants and question ID are required' });
        }

        // Retrieve question info from question service
        let questionData;

        try {
            const response = await fetch(process.env.QUESTION_SERVICE_URL + `/api/questions/${questionId}`);
            questionData = await response.json();
            if (response.status !== 200) {
                return res.status(response.status).json({ message: "Unable to retrieve question data" });
            }
        } catch (err) {
            console.error('Error fetching question data:', err);
            return res.status(500).json({ message: "Unable to retrieve question data" });
        }

        // Check if participants are already in another active session
        const existingSession = await Session.findOne({
            activeUsers: { $elemMatch: { $in: participants } },
            active: true
        });

        if (existingSession) {
            console.log('Participants already in session:', existingSession.activeUsers);
            return res.status(400).json({ message: 'At least one participant is already in another session' });
        }

        const sessionId = uuidv4(); // Use UUID for unique session ID

        const questionTemplateCode = questionData.question.templateCodeYDocUpdate

        console.log('templateCodeYDocUpdate:', questionTemplateCode);
        console.log('questionTemplateCode:', new Uint8Array(questionTemplateCode));

        addUpdateToYDocInRedis(sessionId, questionTemplateCode);
        setLanguageInRedis(sessionId, questionData.question.language.toLowerCase());

        const session = new Session({
            session_id: sessionId, // session_id,
            date_created: new Date(),
            participants,
            language: questionData.question.language,
            question: questionData.question,
            active: true,
            activeUsers: participants,
            yDoc: questionTemplateCode,
        });

        try {
            const data = await session.save();
            res.status(201).json(data);
        } catch (err) {
            console.error('Error creating session:', err); // Log the error
            res.status(500).json({ message: (err as Error).message });
        }
    },
    checkSessionStatus: async (req: Request, res: Response) => {
        const { userId } = req.body

        try {
            // Find an active session that the user is a participant of
            const session = await Session.findOne({ activeUsers: userId, active: true });

            if (!session) {
                // No active session found
                return res.status(204).end();
            }

            res.status(200).json({ message: 'Active session found', sessionId: session.session_id });
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    },
    leaveSession: async (req: Request, res: Response) => {
        const { userId } = req.body;

        try {
            // Find the session with the user in the activeUsers array and active status
            const session = await Session.findOneAndUpdate(
                { activeUsers: userId, active: true },   // Find a session where userId is in activeUsers and active is true
                { $pull: { activeUsers: userId } },       // Remove userId from the activeUsers array
                { new: true }                             // Return the updated document
            );

            if (!session) {
                return res.status(404).json({ message: 'User not in session' });
            }

            res.status(200).json({ message: 'User removed from session', sessionId: session.session_id });
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    },
    terminateSession: async (req: Request, res: Response) => {
        const { userId } = req.body;

        try {
            const session = await Session.findOne({ participants: userId, active: true });

            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }

            // Set active to false instead of deleting the session
            session.active = false;
            await session.save(); // Save the updated session to persist the change

            res.status(200).json({ message: 'Session terminated successfully' });
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    },
    getSessionDetails: async (req: Request, res: Response) => {
        const { userId, sessionId } = req.body;

        try {
            const session = await Session.findOne({ participants: userId, session_id: sessionId, active: false });

            if (!session) {
                return res.status(404).json({ message: 'Session not found' });
            }

            const yDoc = new Y.Doc();
            const yDocBuffer = session.yDoc;
            
            Y.applyUpdateV2(yDoc, new Uint8Array(yDocBuffer));

            // Assuming the text type is named "code"
            const yText = yDoc.getText('code');
            const yDocString = yText.toString();

            res.status(200).json({
                sessionId: session.session_id,
                dateCreated: session.date_created,
                participants: session.participants,
                question: session.question,
                active: session.active,
                attemptCode: yDocString,
                language: session.language,
            });
        } catch (err) {
            res.status(500).json({ message: (err as Error).message });
        }
    }
};
