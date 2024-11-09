import jwt from "jsonwebtoken";
import { findUserById as _findUserById } from "../model/repository.js";

export function verifyAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    console.log("[AUTH] Token verification failed: Missing authorization header");
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      console.log(`[AUTH] Token verification failed: Invalid token - ${err.message}`);
      return res.status(401).json({ message: "Authentication failed" });
    }

    try {
      const dbUser = await _findUserById(user.id);
      if (!dbUser) {
        console.log(`[AUTH] Token verification failed: User not found - ID: ${user.id}`);
        return res.status(401).json({ message: "Authentication failed" });
      } else if (!dbUser.isVerified) {
        console.log(`[AUTH] Token verification failed: Unverified account - ${dbUser.username}`);
        return res.status(403).json({message: "You have not verified your account"});
      }

      req.user = { 
        id: dbUser.id, 
        username: dbUser.username, 
        email: dbUser.email, 
        isAdmin: dbUser.isAdmin 
      };
      console.log(`[AUTH] Token verified for user: ${dbUser.username} (${dbUser.id})`);
      next();
    } catch (error) {
      console.error(`[AUTH] Database error during token verification: ${error.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}

export function verifyAccessTokenForUpdate(req, res, next) {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    console.log("[AUTH] Token verification failed: Missing authorization header");
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      console.log(`[AUTH] Token verification failed: Invalid token - ${err.message}`);
      return res.status(401).json({ message: "Authentication failed" });
    }

    try {
      const dbUser = await _findUserById(user.id);
      if (!dbUser) {
        console.log(`[AUTH] Token verification failed: User not found - ID: ${user.field}`);
        return res.status(401).json({ message: "Authentication failed" });
      } else if (!dbUser.isVerified) {
        console.log(`[AUTH] Token verification failed: Unverified account - ${dbUser.username}`);
        return res.status(403).json({message: "You have not verified your account"});
      }

      if (!user.field) {
        console.log(`[AUTH] User update details failed: Invalid JWT payload`);
        return res.status(401).json({ message: "Token is invalid" });
      } else {
        req.field = user.field;
      }

      req.user = { 
        id: dbUser.id, 
        username: dbUser.username, 
        email: dbUser.email, 
        isAdmin: dbUser.isAdmin 
      };
  
      console.log(`[AUTH] Token verified for user: ${dbUser.username} (${dbUser.id})`);
      next();
    } catch (error) {
      console.error(`[AUTH] Database error during token verification: ${error.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}

export function verifyEmailToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  
  if (!authHeader) {
    console.log("[AUTH] Email token verification failed: Missing authorization header");
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      console.log(`[AUTH] Email token verification failed: ${err.message}`);
      return res.status(401).json({ message: "Authentication failed" });
    }

    try {
      if (user.id !== req.params.id) {
        console.log(`[AUTH] Email token verification failed: Token-param ID mismatch - Token: ${user.id}, Param: ${req.params.id}`);
        return res.status(401).json({ message: "Authentication failed" });
      }

      if (!user.verified) {
        console.log(`[AUTH] Email token verification failed: Token not verified`);
        return res.status(401).json({ message: "Code has not been verified" });
      }

      const dbUser = await _findUserById(user.id);
      if (!dbUser) {
        console.log(`[AUTH] Email token verification failed: User not found - ID: ${user.id}`);
        return res.status(401).json({ message: "Authentication failed" });
      }

      if (dbUser.isVerified) {
        console.log(`[AUTH] Email token verification failed: Account already verified - ${dbUser.username}`);
        return res.status(401).json({message: "Invalid request"});
      }

      if (dbUser.createdAt.getTime() !== new Date(user.createdAt).getTime()) {
        console.log(`[AUTH] Email token verification failed: Token expired for user ${dbUser.username}`);
        return res.status(401).json({ message: "Old token used, use new token instead" });
      }

      req.user = { 
        id: dbUser.id, 
        username: dbUser.username, 
        email: dbUser.email, 
        isAdmin: dbUser.isAdmin, 
        isVerified: dbUser.isVerified, 
        createdAt: dbUser.createdAt, 
        expireAt: dbUser.expireAt
      };
      console.log(`[AUTH] Email token verified for user: ${dbUser.username} (${dbUser.id})`);
      next();
    } catch (error) {
      console.error(`[AUTH] Database error during email token verification: ${error.message}`);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
}

export function verifyIsAdmin(req, res, next) {
  const { username, isAdmin } = req.user;
  if (isAdmin) {
    console.log(`[AUTH] Admin access granted for user: ${username}`);
    next();
  } else {
    console.log(`[AUTH] Admin access denied for user: ${username}`);
    return res.status(403).json({ message: "Not authorized to access this resource" });
  }
}

export function verifyIsOwnerOrAdmin(req, res, next) {
  const { id: tokenId, username, isAdmin } = req.user;
  const paramId = req.params.id;

  if (isAdmin) {
    console.log(`[AUTH] Admin access granted for user: ${username}`);
    return next();
  }

  if (paramId === tokenId) {
    console.log(`[AUTH] Owner access granted for user: ${username}`);
    return next();
  }

  console.log(`[AUTH] Unauthorized access attempt by user: ${username} for resource: ${paramId}`);
  return res.status(403).json({ message: "Not authorized to access this resource" });
}
