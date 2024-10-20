import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "secret";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // console.log("Auth middleware");
  // Implement authentication logic
  // next();
  // const token = req.header("Authorization")?.replace("Bearer ", "");
  const token = req.headers.authorization?.split(" ")[1]; // Extract Bearer token

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET) as JwtPayload;

    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // If authorized, add data to the request body
    req.body = decoded;
    next();
  } catch (ex) {
    res.status(400).json({ message: "Invalid token." });
  }
};

export default authMiddleware;
