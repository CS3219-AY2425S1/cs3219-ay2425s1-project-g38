import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail as _findUserByEmail,
  findUserByUsername as _findUserByUsername,
  confirmUserById as _confirmUserById,
} from "../model/repository.js";
import { formatUserResponse } from "./user-controller.js";
import { transporter } from "../mail.js";

const isEmail = (input) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(input);

const generateEmailToken = (userId, verificationCode, expiresInSeconds) => {
  return jwt.sign({ id: userId, code: verificationCode }, process.env.JWT_SECRET, { expiresIn: expiresInSeconds });
};

const sendPasswordResetLink = async (email, username, resetLink) => {
  return transporter.sendMail({
    from: '"PeerPrep" <peerprep38@gmail.com>',
    to: email,
    subject: 'Reset Your PeerPrep Password',
    html: `
      <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
      <h2 style="text-align: center; color: #6A0CE2;">Reset Your Password</h2>
      <p style="font-size: 16px;">Hello <span style="color: #6A0CE2; font-weight: bold;">${username}</span>,</p>
      <p style="font-size: 16px;">We received a request to reset your password. Please ensure that you opening the link from the same browser you made the request. Click the button below to create a new password:</p>
      <div style="text-align: center; margin: 20px 0;">
          <a href="${resetLink}" style="background-color: #6A0CE2; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Reset Password</a>
      </div>
      <p style="font-size: 16px;">This link will expire in 3 minutes for security reasons.</p>
      <p style="font-size: 14px;">If the button doesn't work, you can copy and paste this link into your browser:</p>
      <a href="${resetLink}" style="font-size: 14px; word-break: break-all; color: #6A0CE2;">${resetLink}</a>
      <p style="font-size: 14px; color: #777;">If you did not request a password reset, please ignore this email and ensure your account is secure.</p>
      <hr style="border-top: 1px solid #eee; margin: 20px 0;">
      <p style="font-size: 14px; text-align: center; color: #aaa;">This is an automated message. Please do not reply.</p>
    </div>
    `,
  });
};

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

export async function handleForgetPassword(req, res) {
  const { identifier } = req.body;
  console.log(`[AUTH] Forget password attempt for user: ${identifier}`);

  if (!identifier) {
    console.log(`[AUTH] Forget password failed: Missing credentials for ${identifier}`);
    return res.status(400).json({ message: "Missing identifier" });
  }

  try {
    const user = isEmail(identifier)
      ? await _findUserByEmail(identifier)
      : await _findUserByUsername(identifier);

    if (!user) {
      console.log(`[AUTH] Forget password failed: User not found - ${identifier}`);
      return res.status(401).json({ message: "Unidentified user" });
    }

    if (!user.isVerified) {
      console.log(`[AUTH] Forget password failed: Unverified account - ${identifier}`);
      return res.status(403).json({message: "You have not verified your account"});
    }

    console.log(`[AUTH] Forget password request successful: ${user.username} (${user.id})`);

    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    const expirationDate = new Date(Date.now() + 3 * 60 * 1000);
    const expiresInSeconds = Math.floor((expirationDate.getTime() - Date.now()) / 1000);

    const jwt = generateEmailToken(user.id, verificationCode, expiresInSeconds);

    const resetLink = `${process.env.FRONTEND_URL}/sign-in/forgot-password/reset?token=${jwt}`;
    await sendPasswordResetLink(user.email, user.username, resetLink);
    console.log(`[AUTH] Reset link email sent - Username: ${user.username}`);

    return res.status(200).json({
      message: "Forget password request success",
      data: {
        token: jwt,
      },
    });
  } catch (err) {
    console.error(`[AUTH] Forget password error: ${err.message}`, err);
    return res.status(500).json({ message: "Unknown error occurred during forget password procedure" });
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
