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

  // For demoing Load Balancer
  console.log("Login Request Received");

  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: "Missing identifier and/or password" });
  }

  try {
    // Determine whether the identifier is an email or a username
    const user = isEmail(identifier)
      ? await _findUserByEmail(identifier)
      : await _findUserByUsername(identifier);

    if (!user) {
      return res.status(401).json({ message: "Wrong username/email and/or password" });
    }

    // Compare the password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Wrong username/email and/or password" });
    }

    if (!user.isVerified) {
      return res.status(403).json({message: "You have not verified your account"});
    }

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
    console.error(err);
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
    const verifiedUser = req.user;
    const user = await _findUserByUsername(verifiedUser.username)
    const password = req.body.password;
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    } else {
      return res.status(200).json({message: "Password verified!"});
    }
  } catch (err) {
    console.log(err.message);
    return res.status(500).json({message: err.message});
  }
}

export async function confirmUser(req, res) {
  try {
    const verifiedUser = req.user;
    const updatedUser = await _confirmUserById(verifiedUser.id, true);

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
    return res.status(500).json({ message: err.message });
  }
}
