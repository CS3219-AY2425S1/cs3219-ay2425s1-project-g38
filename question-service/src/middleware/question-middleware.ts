import { Request, Response, NextFunction } from 'express';
// import jwt, { JwtPayload } from "jsonwebtoken";
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
// const JWT_SECRET = process.env.JWT_SECRET || "secret";
const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || 'http://localhost:8004';

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // console.log("Auth middleware");
  // Implement authentication logic
  // next();
  // const token = req.header("Authorization")?.replace("Bearer ", "");
  const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  try {
    // const decoded: any = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // if (decoded.role !== "admin") {
    //   return res.status(403).json({ message: "Access denied. Admins only." });
    // }

    // // If authorized, add data to the request body
    // req.body = decoded;
    // next();

    // Call the user service to verify the token and get user data
    console.log('Validating user via JWT');
    const response = await axios.get(`${USER_SERVICE_URL}/auth/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = response.data; // Assume user data contains 'isAdmin' field
    console.log('User data:', userData); // Debugging log
    console.log('User is admin:', userData.data.isAdmin); // Debugging log
    if (!userData.data.isAdmin) {
      return res.status(403).json({ message: 'Access Denied. Admins only.' });
    }

    // Proceed to the next middleware/handler if user is admin
    next();
  } catch (err) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401) {
        return res
          .status(401)
          .json({ message: 'Access Denied. Invalid token.' });
      }
      return res
        .status(500)
        .json({ message: 'JWT verification service error.' });
    } else {
      console.error('Unexpected error:', err);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};

export default authMiddleware;
