import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { RequestHandler } from "express";
import { User } from "../../../database/models";
import { IJsonUserFromDbNoLevels } from "../../../types";
import asyncHandler from "express-async-handler";
import { throwAuthError, throwNotFound } from "../errorThrowers";

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

const authorizer = (requiredLevel: string): RequestHandler =>
  asyncHandler(async (req, _res, next) => {
    const authHeader = req.get("authorization");
    if (!authHeader) {
      throwAuthError("token missing");
      return;
    }
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      throwAuthError("token malformed");
    }
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, String(process.env.JWT));
    if (typeof decoded !== "object") {
      throwAuthError("token invalid");
      return;
    }
    const { userlevels } = decoded as IAuthObject;
    const dbUser = await User.findOne({ where: { id: decoded.id } });
    if (dbUser instanceof User) {
      const user: IJsonUserFromDbNoLevels = dbUser.toJSON();
      if (user.disabled === true) {
        throwAuthError("user disabled");
        return;
      }
    } else {
      throwNotFound("user not found");
      return;
    }
    if (!userlevels.includes(requiredLevel)) {
      throwAuthError("unauthorized");
      return;
    }
    req.decodedToken = decoded;
    next();
  });

export default authorizer;
