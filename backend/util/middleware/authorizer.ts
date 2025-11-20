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

interface IAuthorizationCheckEntry {
  userId: number;
  reqId: number | null;
  userlevels: string[];
  requiredLevel: string;
  reqUrl: string;
}

// Check if user is allowed to route
const authorizationCheck = (values: IAuthorizationCheckEntry): boolean => {
  const { userId, reqId, userlevels, requiredLevel, reqUrl } = values;
  if (userlevels.includes("hal")) return true;

  if (requiredLevel === "admin/user") {
    if (reqUrl.endsWith("/api/auth/me")) return true;
    if (userlevels.includes("admin")) return true;
    if (reqId && userId === reqId) return true;
  }
  if (userlevels.includes(requiredLevel)) return true;
  return false;
};

// Checks authorization
const authorizer = (requiredLevel: string): RequestHandler =>
  asyncHandler(async (req, _res, next) => {
    // For development cases
    const returnError = 0;
    if (returnError) {
      throwAuthError("returnError set 1");
      return;
    }
    const skipAuthorizer = 0;
    if (skipAuthorizer) {
      return next();
    }
    const reqUrl = req.originalUrl;
    // Checks for authorization header
    const authHeader = req.get("authorization");
    if (!authHeader) {
      throwAuthError("token missing");
      return;
    }
    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      throwAuthError("token malformed");
    }
    // Checks jwt and get base values from jwt user
    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, String(process.env.JWT));
    if (typeof decoded !== "object") {
      throwAuthError("token invalid");
      return;
    }
    const { userlevels, id } = decoded as IAuthObject;
    // Check if user is disabled
    const dbUser = await User.findOne({
      where: { id: Number(id) },
    });
    if (!dbUser) {
      throwNotFound(`user not found`);
      return;
    }
    const user: IJsonUserFromDbNoLevels = dbUser.toJSON();
    if (user.disabled === true) {
      throwAuthError("user disabled");
      return;
    }
    // Check authorization and add decoded token to reqest

    const authCheckObj = {
      userId: Number(id),
      reqId: Number(req.params.id) || null,
      userlevels,
      requiredLevel,
      reqUrl,
    };
    if (!authorizationCheck(authCheckObj)) {
      throwAuthError("unauthorized");
      return;
    }

    req.decodedToken = decoded;
    next();
  });

export default authorizer;
