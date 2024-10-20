import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail as _findUserByEmail,
  findUserByUsername as _findUserByUsername
} from "../model/repository.js";
import { formatUserResponse } from "./user-controller.js";

const isEmail = (input) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(input);

export async function handleLogin(req, res) {
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
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Compare the password with the hashed password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Generate JWT access token
    // const accessToken = jwt.sign(
    //   { id: user.id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: "1d" }
    // );

    return res.status(200).json({
      message: "User logged in",
      data: {
        //accessToken,
        ...formatUserResponse(user),
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ Message: "Unauthorized" });
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
