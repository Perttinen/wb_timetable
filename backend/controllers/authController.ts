import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt, { JwtPayload, VerifyErrors } from "jsonwebtoken";

import { User } from "../../database/models";
import { addUserlevels, userlevelsToArray } from "./commonFuncs";
import {
  throwAuthError,
  throwNotFound,
  throwValidationError,
} from "../util/errorThrowers";
import { ICheckPasswordArgs, IJsonUserFlattenedLevels } from "../../types";

dotenv.config();

interface ILoginUser {
  username: string;
  password: string;
}

const login = asyncHandler(
  async (
    req: Request<unknown, unknown, ILoginUser>,
    res: Response<{ token: string; user: IJsonUserFlattenedLevels }>
  ) => {
    const { username, password: reqPwd } = req.body;

    // Check required fields existence
    if (!username || !reqPwd) {
      throwValidationError("missing input field(s)");
      return;
    }

    // Get user from db
    const dbUser = await User.findOne({
      where: { username },
      ...addUserlevels,
    });
    if (!dbUser) {
      throwNotFound("user not found");
      return;
    }

    // Check password, create token and response user with token
    const { password, ...safeUser } = userlevelsToArray(dbUser);
    const passwordCorrect = await bcrypt.compare(reqPwd, password);
    if (!passwordCorrect) {
      throwAuthError("invalid password");
      return;
    }
    const token = jwt.sign(
      { id: safeUser.id, userlevels: safeUser.userlevels },
      String(process.env.JWT_ACCESS),
      {
        expiresIn: "3h",
      }
    );

    const refreshToken = jwt.sign(
      { id: safeUser.id },
      String(process.env.JWT_REFRESH),
      {
        expiresIn: "1d",
      }
    );

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ token, user: safeUser });
  }
);

interface AuthenticatedRequest extends Request {
  cookies: {
    jwt?: string;
    [key: string]: string | undefined;
  };
}

const refresh = (req: AuthenticatedRequest, res: Response) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    String(process.env.JWT_REFRESH),
    async (
      err: VerifyErrors | null,
      decoded: JwtPayload | string | undefined
    ) => {
      if (err) {
        res.status(403).json({ message: "Forbidden" });
        return;
      }

      const payload = decoded as JwtPayload;

      const foundUser = await User.findOne({
        attributes: { exclude: ["password"] },
        where: { id: Number(payload.id) },
        ...addUserlevels,
      });

      if (!foundUser) {
        res.status(401).json({ message: "Unauthorized" });
        return;
      }
      const safeUser = userlevelsToArray(foundUser);

      const accessToken = jwt.sign(
        {
          id: safeUser.id,
          userlevels: safeUser.userlevels,
        },
        String(process.env.ACCESS_TOKEN_SECRET),
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

const me = asyncHandler(
  async (req, res: Response<IJsonUserFlattenedLevels>) => {
    const dt = req.decodedToken;

    const user = (await User.findByPk(req.decodedToken.id))?.toJSON();
    if (!user || !dt) {
      throwNotFound("user not found");
      return;
    }
    const me = {
      username: user.username,
      id: user.id as number,
      disabled: user.disabled,
      userlevels: dt.userlevels as string[],
    };
    res.status(200).json(me);
  }
);

const pw = asyncHandler(
  async (
    req: Request<unknown, unknown, ICheckPasswordArgs>,
    res: Response<boolean>
  ) => {
    const reqPwd = req.body.password;

    const user = (await User.findByPk(req.decodedToken.id))?.toJSON();

    if (user) {
      console.log("user: ", user);
      const passwordCorrect = await bcrypt.compare(reqPwd, user?.password);
      if (!passwordCorrect) {
        throwAuthError("Password mismatch");
      }
      res.status(200).json(passwordCorrect);
    }
    return;
  }
);

export default {
  login,
  me,
  pw,
  refresh,
};
