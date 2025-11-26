import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { User } from "../../../database/models";
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

const authorizer = (requiredLevel: string): RequestHandler =>
  asyncHandler(async (req, _res, next) => {
    // Set 1 to return error, for test cases
    const returnError = 0;
    if (returnError) {
      throwAuthError("returnError set 1");
      return;
    }
    // Set 1 to skip authorizer, for test cases
    const skipAuthorizer = 0;
    if (skipAuthorizer) {
      return next();
    }

    const reqUrl = req.originalUrl;

    const authHeader = req.get("authorization");

    if (!authHeader) {
      throwAuthError("token missing");
      return;
    }

    if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
      throwAuthError("token malformed");
    }

    const token = authHeader.substring(7);

    const decoded = jwt.verify(token, String(process.env.JWT_ACCESS));

    if (typeof decoded !== "object") {
      throwAuthError("token invalid");
      return;
    }

    const { userlevels, id } = decoded as IAuthObject;

    const dbUser = await User.findOne({
      where: { id: Number(id) },
    });

    if (!dbUser) {
      throwNotFound(`user not found`);
      return;
    }

    if (dbUser.disabled === true) {
      throwAuthError("user disabled");
      return;
    }

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
