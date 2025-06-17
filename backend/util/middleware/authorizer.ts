import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { RequestHandler } from "express";

dotenv.config();

declare module "express-serve-static-core" {
  interface Request {
    decodedToken: jwt.JwtPayload;
  }
}

interface IAuthObject extends jwt.JwtPayload {
  userlevels: string[];
  disabled: boolean;
}

const authorizer = (requiredLevel: string): RequestHandler => {
  return (req, res, next) => {
    const authHeader = req.get("authorization");

    if (!authHeader?.toLowerCase().startsWith("bearer ")) {
      res.status(401).json({ error: "token missing" });
      return;
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, String(process.env.JWT));
    if (typeof decoded !== "object") {
      res.status(401).json({ error: "token invalid" });
      return;
    }
    const { userlevels, disabled } = decoded as IAuthObject;
    if (disabled) {
      res.status(401).json({ error: "user disabled" });
      return;
    }
    if (!userlevels.includes(requiredLevel)) {
      res.status(401).json({ error: "unauthorized" });
      return;
    }
    req.decodedToken = decoded;
    next();
  };
};

export default authorizer;
