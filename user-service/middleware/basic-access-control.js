import jwt from "jsonwebtoken";
import { findUserById as _findUserById } from "../model/repository.js";

export function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    console.log("token verification failed")

    return res.status(401).json({ message: "Authentication failed" });
  }

  // request auth header: `Authorization: Bearer + <access_token>`
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      console.log("token verification failed")

      return res.status(401).json({ message: "Authentication failed" });
    }

    // load latest user info from DB
    const dbUser = await _findUserById(user.id);
    if (!dbUser) {
      console.log("token verification failed")
      return res.status(401).json({ message: "Authentication failed" });
    }

    req.user = { id: dbUser.id, username: dbUser.username, email: dbUser.email, isAdmin: dbUser.isAdmin };
    console.log("token verified")
    next();
  });
}

export function verifyEmailToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  // request auth header: `Authorization: Bearer + <access_token>`
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    if (user.id !== req.params.id) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // load latest user info from DB
    const dbUser = await _findUserById(user.id);
    if (!dbUser) {
      return res.status(401).json({ message: "Authentication failed" });
    } else if (dbUser.isVerified) {
      return res.status(401).json({message: "Invalid request"});
    }

    if (dbUser.createdAt.getTime() !== new Date(user.createdAt).getTime()) {
      return res.status(401).json({ message: "Old token used, use new token instead" });
    }
    req.user = { id: dbUser.id, username: dbUser.username, email: dbUser.email, isAdmin: dbUser.isAdmin, isVerified: dbUser.isVerified, createdAt: dbUser.createdAt, expireAt: dbUser.expireAt};
    next();
  });
}

export function verifyIsAdmin(req, res, next) {
  if (req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Not authorized to access this resource" });
  }
}

export function verifyIsOwnerOrAdmin(req, res, next) {
  console.log(req);
  if (req.user.isAdmin) {
    return next();
  }

  const userIdFromReqParams = req.params.id;
  const userIdFromToken = req.user.id;
  if (userIdFromReqParams === userIdFromToken) {
    return next();
  }

  return res.status(403).json({ message: "Not authorized to access this resource" });
}
