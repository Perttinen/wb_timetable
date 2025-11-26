import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

import { User } from "../../database/models";
import { addUserlevels, userlevelsToArray } from "../util/helperFunctions";
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
// @access user
const checkPassword = asyncHandler(
  async (
    req: Request<unknown, unknown, authTypes.TCheckPasswordArgs>,
    res: Response<boolean>
  ) => {
    const reqPwd = req.body.password;

    if (!reqPwd) {
      throwNotFound("missing password");
    }

    const user = (await User.findByPk(req.decodedToken.id))?.toJSON();

    if (!user) {
      throwNotFound("user not found");
      return;
    }

    const passwordCorrect = await bcrypt.compare(reqPwd, user.password);

    if (!passwordCorrect) {
      throwAuthError("unauthorized");
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
    }

    const rawUser = await User.findOne({
      where: { username },
      ...addUserlevels,
    });

    if (!rawUser) {
      throwNotFound("user not found");
      return;
    }

    const { password, ...safeUser } = userlevelsToArray(rawUser);

    const passwordCorrect = await bcrypt.compare(reqPwd, password);

    if (!passwordCorrect) {
      throwAuthError("invalid password");
    }

    const accessToken = jwt.sign(
      { id: safeUser.id, userlevels: safeUser.userlevels },
      String(process.env.JWT_ACCESS),
      {
        // Set this value also in auth/refresh!
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      { id: safeUser.id },
      String(process.env.JWT_REFRESH),
      {
        expiresIn: "7d",
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

// @desc logout
// @route POST /auth/logout
// @access public
const logout = asyncHandler((req: Request, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) res.sendStatus(204);

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true });

  res.json({ message: "Cookie cleared" });
});

// @desc returns user based on access token
// @route GET /auth/me
// @access user
const me = asyncHandler(async (req, res: Response<userTypes.TUser>) => {
  if (!req.decodedToken || !req.decodedToken.id) {
    throwAuthError("invalid token");
  }

  const rawUser = await User.findOne({
    attributes: { exclude: ["password"] },
    where: { id: Number(req.decodedToken.id) },
    ...addUserlevels,
  });

  if (!rawUser) {
    throwNotFound("user not found");
    return;
  }
  res.status(200).json(userlevelsToArray(rawUser));
});

// @desc Refresh access token
// @route GET /auth/refresh
// @access Public
const refresh = (
  req: AuthenticatedRequest,
  res: Response<{ accessToken: string }>
) => {
  const refreshToken = req.cookies.jwt;
  console.log(`refreshing token ${new Date(Date.now()).toTimeString()}`);

  if (!refreshToken) {
    throwAuthError("You have to login at least once in week");
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
      }

      const id = Number((decoded as JwtPayload).id);

      const rawUser = await User.findOne({
        attributes: { exclude: ["password"] },
        where: { id },
        ...addUserlevels,
      });

      if (!rawUser) {
        throwAuthError("Unauthorized");
        return;
      }

      const user = userlevelsToArray(rawUser);

      const accessToken = jwt.sign(
        {
          id: user.id,
          userlevels: user.userlevels,
        },
        String(process.env.JWT_ACCESS),
        // Set this value also in auth/login!
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

export default {
  checkPassword,
  login,
  logout,
  me,
  refresh,
};
