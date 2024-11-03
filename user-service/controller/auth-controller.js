import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail as _findUserByEmail,
  findUserByUsername as _findUserByUsername,
  confirmUserById as _confirmUserById,
} from "../model/repository.js";
import { formatUserResponse } from "./user-controller.js";

const isEmail = (input) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(input);

export async function handleLogin(req, res) {
  const { identifier, password } = req.body;
  console.log(`[AUTH] Login attempt for user: ${identifier}`);

  if (!identifier || !password) {
    console.log(`[AUTH] Login failed: Missing credentials for ${identifier}`);
    return res.status(400).json({ message: "Missing identifier and/or password" });
  }

  try {
    const user = isEmail(identifier)
      ? await _findUserByEmail(identifier)
      : await _findUserByUsername(identifier);

    if (!user) {
      console.log(`[AUTH] Login failed: User not found - ${identifier}`);
      return res.status(401).json({ message: "Wrong username/email and/or password" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.log(`[AUTH] Login failed: Invalid password for user ${identifier}`);
      return res.status(401).json({ message: "Wrong username/email and/or password" });
    }

    if (!user.isVerified) {
      console.log(`[AUTH] Login failed: Unverified account - ${identifier}`);
      return res.status(403).json({message: "You have not verified your account"});
    }

    console.log(`[AUTH] Login successful: ${user.username} (${user.id})`);
    // Generate JWT access token
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: "User logged in",
      data: {
        accessToken,
        ...formatUserResponse(user),
      },
    });
  } catch (err) {
    console.error(`[AUTH] Login error: ${err.message}`, err);
    return res.status(500).json({ message: "Unknown error occurred during login" });
  }
}

export async function handleVerifyToken(req, res) {
  try {
    const verifiedUser = req.user;
    return res.status(200).json({ message: "Token verified", data: verifiedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

export async function verifyPassword(req, res) {
  try {
    const { username } = req.user;
    console.log(`[AUTH] Password verification attempt for user: ${username}`);
    
    const user = await _findUserByUsername(username);
    const match = await bcrypt.compare(req.body.password, user.password);
    
    if (!match) {
      console.log(`[AUTH] Password verification failed for user: ${username}`);
      return res.status(401).json({ message: "Wrong password" });
    }
    
    console.log(`[AUTH] Password verified successfully for user: ${username}`);
    return res.status(200).json({message: "Password verified!"});
  } catch (err) {
    console.error(`[AUTH] Password verification error: ${err.message}`, err);
    return res.status(500).json({message: err.message});
  }
}

export async function confirmUser(req, res) {
  try {
    const { id, username } = req.user;
    console.log(`[AUTH] Account confirmation attempt for user: ${username} (${id})`);

    const updatedUser = await _confirmUserById(id, true);
    console.log(`[AUTH] Account confirmed successfully for user: ${username} (${id})`);

    // Generate JWT access token
    const accessToken = jwt.sign(
      { id: updatedUser.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      message: `${updatedUser.id} registered and logged in!`,
      data: {
        accessToken,
        ...formatUserResponse(updatedUser),
      },
    });
  } catch (err) {
    console.error(`[AUTH] Account confirmation error: ${err.message}`, err);
    return res.status(500).json({ message: err.message });
  }
}
