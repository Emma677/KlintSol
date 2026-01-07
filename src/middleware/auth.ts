import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error("JWT_SECRET is not defined");
}

interface AuthPayload extends JwtPayload {
  _id: string;
  // role: "user" | "seller" | "admin";
  userName: string;
}

const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized. Token missing or invalid.",success:false
    });
  }

  const token = authHeader.split(" ")[1];

 if (!token) {
    res.status(401).json({ message: "Invalid token format." });
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret as string) as AuthPayload;
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
