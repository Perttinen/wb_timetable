import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

import { User } from "../../database/models";
import { addUserlevels, userlevelsToArray } from "./commonFuncs";

dotenv.config();

interface ILoginUser {
  username: string;
  password: string;
}

const login = asyncHandler(
  async (req: Request<unknown, unknown, ILoginUser>, res: Response) => {
    const { username, password: reqPwd } = req.body;
    const dbUser = await User.findOne({
      where: { username: username },
      ...addUserlevels,
    });
    if (dbUser) {
      const { password, ...safeUser } = userlevelsToArray(dbUser);
      const passwordCorrect = await bcrypt.compare(reqPwd, password);
      if (passwordCorrect) {
        const token = jwt.sign(safeUser, String(process.env.SECRET));
        res.status(200).json({ token, ...safeUser });
      } else {
        res.status(401).json({
          error: "invalid password",
        });
      }
    } else {
      res.status(401).json({
        error: "invalid username",
      });
    }
  }
);

export default {
  login,
};
