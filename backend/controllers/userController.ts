import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Op } from "@sequelize/core";

import {
  ICreateUserEntry,
  IUpdateUserEntry,
  IJsonUser,
  IJsonUserPw,
  IUserlevel,
} from "../../types";
import { User, UserAndlevel, Userlevel } from "../../database/models";
import { addUserlevels } from "./commonFuncs";

// Converts User object to json and User.userlevels to array.
const userlevelsToArray = (user: User) => {
  const jsonUser: IJsonUser = user.toJSON();
  const returnUser = {
    ...jsonUser,
    userlevels: jsonUser.userlevels.map((ul) => ul.userlevel),
  };
  return returnUser;
};

const getUserlevels = async () => {
  const userlevels: IUserlevel[] = (await Userlevel.findAll()).map((ul) =>
    ul.toJSON()
  );
  return userlevels;
};

const validateUserlevelInput = ({
  userlevel,
  allUserlevels,
}: {
  userlevel: string[];
  allUserlevels: IUserlevel[];
}): number[] => {
  const uniqueInputLevels = userlevel.filter(
    (value: string, index: number, array: string[]) =>
      array.indexOf(value) === index
  );
  const validatedInputLevelIds = allUserlevels
    .filter((ul) => uniqueInputLevels.includes(ul.userlevel))
    .map((ul) => ul.id);
  if (userlevel.length !== validatedInputLevelIds.length) return [];
  return validatedInputLevelIds;
};

const createNewUser = asyncHandler(
  async (req: Request<unknown, unknown, ICreateUserEntry>, res: Response) => {
    const { username, password, userlevel } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: IJsonUserPw = (
      await User.create({ username, password: passwordHash })
    ).toJSON();
    const allUserlevels = await getUserlevels();
    // If not userlevel add "user" as userlevel. If valid userlevels then add them. If not valid destroy created user.
    if (userlevel) {
      const validatedInputLevelIds = validateUserlevelInput({
        allUserlevels,
        userlevel,
      });
      if (validatedInputLevelIds.length < 1) {
        await User.destroy({ where: { id: newUser.id } });
        res.status(406).json({ message: "Userlevels array is not valid" });
      }
      const userlevelsToSave = validatedInputLevelIds.map((ul) => {
        return { userlevelId: ul, userId: newUser.id };
      });
      await UserAndlevel.bulkCreate(userlevelsToSave);
    } else {
      const userlevelUser = allUserlevels.find((ul) => ul.userlevel === "user");
      if (userlevelUser) {
        await UserAndlevel.create({
          userlevelId: userlevelUser.id,
          userId: newUser.id,
        });
      }
    }
    const createdUser = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { id: newUser.id },
      ...addUserlevels,
    });
    if (createdUser) {
      res.status(201).json(userlevelsToArray(createdUser));
    }
  }
);

const deleteAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const hal = await User.findOne({
    attributes: { exclude: ["password"] },
    where: { username: "hal" },
    ...addUserlevels,
  });
  if (hal) {
    const jsonHal: IJsonUser = hal.toJSON();
    await UserAndlevel.destroy({
      where: { userId: { [Op.not]: jsonHal.id } },
    });
    await User.destroy({ where: { id: { [Op.not]: jsonHal.id } } });
  }
  res.status(204).end();
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  await UserAndlevel.destroy({
    where: { userId: req.params.id },
  });
  await User.destroy({ where: { id: req.params.id } });
  res.status(204).end();
});

const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.findAll({
    attributes: { exclude: ["password"] },
    ...addUserlevels,
  });

  const resUsers = users.map((u) => userlevelsToArray(u));
  if (users) res.status(200).json(resUsers);
  res.status(400).end();
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({
    attributes: { exclude: ["password"] },
    where: { id: req.params.id },
    ...addUserlevels,
  });
  if (user) {
    res.status(200).json(userlevelsToArray(user));
  } else {
    res.status(404).end();
  }
});

const updateUser = asyncHandler(
  async (req: Request<unknown, unknown, IUpdateUserEntry>, res: Response) => {
    const id = req.body.id;
    const userToUpdate = await User.findOne({ where: { id } });
    if (!userToUpdate) {
      res.status(400).json({ message: "User not found" });
      return;
    }
    const jsonUser: IJsonUserPw = userToUpdate.toJSON();
    if (req.body.username) jsonUser.username = req.body.username;
    if (req.body.password)
      jsonUser.password = await bcrypt.hash(req.body.password, 10);
    if (req.body.disabled === true || req.body.disabled === false) {
      jsonUser.disabled = req.body.disabled;
    }
    const userlevel = req.body.userlevels;
    if (userlevel) {
      const allUserlevels = await getUserlevels();
      const validatedInputLevelIds = validateUserlevelInput({
        allUserlevels,
        userlevel,
      });
      if (
        validatedInputLevelIds.length > 0 &&
        validatedInputLevelIds.length === userlevel.length
      ) {
        await UserAndlevel.destroy({ where: { userId: id } });
        const userlevelsToSave = validatedInputLevelIds.map((ul) => {
          return { userlevelId: ul, userId: id };
        });
        await UserAndlevel.bulkCreate(userlevelsToSave);
      } else {
        res.status(406).json({ message: "Userlevels array is not valid" });
      }
    }
    await userToUpdate.update(jsonUser);
    const user = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { id: id },
      ...addUserlevels,
    });
    if (user) {
      res.status(200).json(userlevelsToArray(user));
    } else {
      res.status(404).end();
    }
  }
);

export default {
  createNewUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteAllUsers,
};
