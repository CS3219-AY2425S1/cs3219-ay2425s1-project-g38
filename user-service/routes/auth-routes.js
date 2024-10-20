import express from "express";

import { handleLogin, handleVerifyToken } from "../controller/auth-controller.js";
import { verifyAccessToken, verifyApiKey } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/verify", verifyApiKey, handleLogin)

router.post("/login", handleLogin);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

export default router;
