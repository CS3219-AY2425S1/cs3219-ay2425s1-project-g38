import { Request, Response, Router } from "express";
import { validateApiJWT, validateApiKey } from '../middleware/jwt-validation';
import { sessionController } from "../controller/session-controller";

const router = Router();

// Test route
router.get('/', (req, res) => {res.send('Hello from session service!')});

// Create a new session
router.post("/create", validateApiKey, sessionController.createSession);

// Check if user is in a session
router.get("/check", validateApiJWT, sessionController.checkSessionStatus);

// Remove user from session
router.get("/leave", validateApiJWT, sessionController.leaveSession);

export default router;
