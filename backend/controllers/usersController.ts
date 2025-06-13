import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import {
  ICreateUserEntry,
  IUpdateUserEntry,
  IJsonUser,
  IJsonUserPw,
  IUserlevel,
} from "../../types";
import { User, UserAndlevel, Userlevel } from "../../database/models";

// Converts User object to json and User.userlevels to array.
const userlevelsToArray = (user: User) => {
  const jsonUser: IJsonUser = user.toJSON();
  const returnUser = {
    ...jsonUser,
    userlevels: jsonUser.userlevels.map((ul) => ul.userlevel),
  };
  return returnUser;
};

// User getter common parameters
const getUserParams = {
  attributes: { exclude: ["password"] },
  include: [
    {
      model: Userlevel,
      attributes: ["userlevel"],
      through: {
        attributes: [],
      },
    },
  ],
};

const createNewUser = asyncHandler(
  async (req: Request<unknown, unknown, ICreateUserEntry>, res: Response) => {
    const { username, password, userlevel } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser: IJsonUserPw = (
      await User.create({ username, password: passwordHash })
    ).toJSON();
    const userLevels: IUserlevel[] = (await Userlevel.findAll()).map((ul) =>
      ul.toJSON()
    );
    if (userlevel) {
      const userlevelNames: string[] = userLevels.map((ul) => ul.userlevel);
      for (const e of userlevel) {
        if (!userlevelNames.includes(e)) {
          await User.destroy({ where: { id: newUser.id } });
          res.status(406).json({ message: "Userlevels array is not valid" });
        }
      }
      const requestedUserlevels = userLevels
        .filter((ul) => userlevel.includes(ul.userlevel))
        .map((ul) => {
          return { userlevelId: ul.id, userId: newUser.id };
        });
      await UserAndlevel.bulkCreate(requestedUserlevels);
    } else {
      const userlevelUser = userLevels.find((ul) => ul.userlevel === "user");
      if (userlevelUser) {
        await UserAndlevel.create({
          userlevelId: userlevelUser.id,
          userId: newUser.id,
        });
      }
    }
    const createdUser = await User.findOne({
      where: { id: newUser.id },
      ...getUserParams,
    });
    if (createdUser) {
      res.status(201).json(userlevelsToArray(createdUser));
    }
  }
);

const deleteAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const userAndLevelDestroyed = await UserAndlevel.destroy({ where: {} });
  const userDestroyed = await User.destroy({ where: {} });
  if (userAndLevelDestroyed && userDestroyed)
    res.status(204).json({ message: "All users deleted successfully" });
});

const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userAndLevelDestroyed = await UserAndlevel.destroy({
    where: { userId: req.params.id },
  });
  const userDestroyed = await User.destroy({ where: { id: req.params.id } });
  if (userAndLevelDestroyed && userDestroyed)
    res.status(204).json({ message: "User deleted successfully" });
});

const getAllUsers = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.findAll(getUserParams);
  const resUsers = users.map((u) => userlevelsToArray(u));
  if (users) res.json(resUsers);
  res.status(404).end();
});

const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findOne({
    where: { id: req.params.id },
    ...getUserParams,
  });
  if (user) {
    res.json(userlevelsToArray(user));
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

    const newUserlevels = req.body.userlevels;
    if (newUserlevels) {
      const jsonUserlevels: IUserlevel[] = (await Userlevel.findAll()).map(
        (ul) => ul.toJSON()
      );
      await UserAndlevel.destroy({ where: { userId: id } });
      const newUserAndLevels = jsonUserlevels
        .filter((ul) => newUserlevels.includes(ul.userlevel))
        .map((ul) => ({ userlevelId: ul.id, userId: id }));
      await UserAndlevel.bulkCreate(newUserAndLevels);
    }
    await userToUpdate.update(jsonUser);
    const updatedUser = await User.findByPk(id);
    if (updatedUser) res.json(userlevelsToArray(updatedUser));
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
