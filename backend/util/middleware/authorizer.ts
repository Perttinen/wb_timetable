import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { RequestHandler } from "express";
import { User } from "../../../database/models";
import { IJsonUserFromDbNoLevels } from "../../../types";

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
  return async (req, res, next) => {
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

    const { userlevels } = decoded as IAuthObject;

    const dbUser = await User.findOne({ where: { id: decoded.id } });

    if (dbUser instanceof User) {
      const user: IJsonUserFromDbNoLevels = dbUser.toJSON();
      if (user.disabled === true) {
        res.status(401).json({ error: "user disabled" });
        return;
      }
    } else {
      res.status(401).json({ error: "user not found" });
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
