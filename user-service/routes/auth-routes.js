import express from "express";

import { handleLogin, handleVerifyToken, confirmUser, verifyPassword } from "../controller/auth-controller.js";
import { verifyAccessToken, verifyEmailToken } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/login", handleLogin);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

router.post("/verify-password", verifyAccessToken, verifyPassword)

router.patch("/:id", verifyEmailToken, confirmUser);

export default router;
