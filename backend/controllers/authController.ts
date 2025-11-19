import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { User } from "../../database/models";
import { addUserlevels, userlevelsToArray } from "./commonFuncs";
import {
  throwAuthError,
  throwNotFound,
  throwValidationError,
} from "../util/errorThrowers";
import { IJsonUserFlattenedLevels } from "../../types";

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
      String(process.env.JWT),
      {
        expiresIn: "3h",
      }
    );
    res.status(200).json({ token, user: safeUser });
  }
);

const me = asyncHandler(
  async (req, res: Response<IJsonUserFlattenedLevels>) => {
    console.log("getMe");

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

export default {
  login,
  me,
};
