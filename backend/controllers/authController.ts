import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

import { User } from "../../database/models";
import { addUserlevels, userlevelsToArray } from "./helperFunctions";
import {
  throwAuthError,
  throwNotFound,
  throwValidationError,
} from "../util/errorThrowers";
import { authTypes, userTypes } from "../../types";

dotenv.config();

interface AuthenticatedRequest extends Request {
  cookies: {
    jwt?: string;
    [key: string]: string | undefined;
  };
}

// @desc password test
// @route GET /auth/checkpw
// @access admin/user
const checkPassword = asyncHandler(
  async (
    req: Request<unknown, unknown, authTypes.TCheckPasswordArgs>,
    res: Response<boolean>
  ) => {
    const reqPwd = req.body.password;

    if (!reqPwd) {
      throwNotFound("missing password");
      return;
    }

    const user = (await User.findByPk(req.decodedToken.id))?.toJSON();

    if (!user) {
      throwNotFound("user not found");
      return;
    }

    const passwordCorrect = await bcrypt.compare(reqPwd, user.password);

    if (!passwordCorrect) {
      throwAuthError("password incorrect");
      return;
    }

    res.status(200).json(passwordCorrect);
  }
);

// @desc Login
// @route POST /auth/login
// @access Public
const login = asyncHandler(
  async (
    req: Request<unknown, unknown, authTypes.TLoginArgs>,
    res: Response<{
      token: string;
      user: userTypes.TUserSafe;
    }>
  ) => {
    const { username, password: reqPwd } = req.body;

    if (!username || !reqPwd) {
      throwValidationError("missing input field(s)");
      return;
    }

    const dbUser = await User.findOne({
      where: { username },
      ...addUserlevels,
    });

    if (!dbUser) {
      throwNotFound("user not found");
      return;
    }

    const { password, ...safeUser } = userlevelsToArray(dbUser);

    const passwordCorrect = await bcrypt.compare(reqPwd, password);

    if (!passwordCorrect) {
      throwAuthError("invalid password");
      return;
    }

    const accessToken = jwt.sign(
      { id: safeUser.id, userlevels: safeUser.userlevels },
      String(process.env.JWT_ACCESS),
      {
        expiresIn: 15 * 60,
      }
    );

    const refreshToken = jwt.sign(
      { id: safeUser.id },
      String(process.env.JWT_REFRESH),
      {
        expiresIn: "3h",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token: accessToken, user: safeUser });
  }
);

// @desc returns user based on access token
// @route GET /auth/me
// @access admin/user
const me = asyncHandler(async (req, res: Response<userTypes.TUser>) => {
  if (!req.decodedToken || !req.decodedToken.id) {
    throwAuthError("invalid token");
    return;
  }

  const dbUser = await User.findOne({
    attributes: { exclude: ["password"] },
    where: { id: Number(req.decodedToken.id) },
    ...addUserlevels,
  });

  if (!dbUser) {
    throwNotFound("user not found");
    return;
  }

  res.status(200).json(userlevelsToArray(dbUser));
});

// @desc Refresh access token
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (
  req: AuthenticatedRequest,
  res: Response<{ accessToken: string }>
) => {
  const refreshToken = req.cookies.jwt;

  if (!refreshToken) {
    throwAuthError("Unauthorized");
    return;
  }

  jwt.verify(
    refreshToken,
    String(process.env.JWT_REFRESH),
    async (
      err: VerifyErrors | null,
      decoded: JwtPayload | string | undefined
    ) => {
      if (err) {
        throwAuthError("Forbidden");
        return;
      }

      const id = Number((decoded as JwtPayload).id);

      const dbUser = await User.findOne({
        attributes: { exclude: ["password"] },
        where: { id },
        ...addUserlevels,
      });

      if (!dbUser) {
        throwAuthError("Unauthorized");
        return;
      }

      const user = userlevelsToArray(dbUser);

      const accessToken = jwt.sign(
        {
          id: user.id,
          userlevels: user.userlevels,
        },
        String(process.env.JWT_ACCESS),
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

export default {
  checkPassword,
  login,
  me,
  refresh,
};
