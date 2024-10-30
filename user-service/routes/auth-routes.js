import express from "express";

import { handleLogin, handleVerifyToken, confirmUser } from "../controller/auth-controller.js";
import { verifyAccessToken, verifyEmailToken } from "../middleware/basic-access-control.js";

const router = express.Router();

router.post("/login", handleLogin);

router.get("/verify-token", verifyAccessToken, handleVerifyToken);

router.patch("/:id", verifyEmailToken, confirmUser);

export default router;
