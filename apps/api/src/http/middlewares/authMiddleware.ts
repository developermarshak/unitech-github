import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { jwtConfig } from "../../config/jwt.js";
import { AuthenticationError } from "../../errors/AuthenticationError.js";

interface JwtPayload {
  userId: string;
  sessionId: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        sessionId: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AuthenticationError("Missing or invalid authorization header");
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = jwt.verify(token, jwtConfig.publicKey, {
      algorithms: ["RS256"],
    }) as JwtPayload;

    // Attach user information to request object
    req.user = {
      id: decoded.userId,
      sessionId: decoded.sessionId,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new AuthenticationError("Invalid token"));
    } else if (error instanceof jwt.TokenExpiredError) {
      next(new AuthenticationError("Token expired"));
    } else {
      next(error);
    }
  }
};
