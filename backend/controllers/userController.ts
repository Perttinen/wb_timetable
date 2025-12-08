import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Op } from "@sequelize/core";

import { User, UserAndlevel, Userlevel } from "../../database/models";
import {
  addUserlevels,
  getUserlevels,
  userlevelsToArray,
  validateUserlevelInput,
} from "../util/helperFunctions";
import { throwNotFound, throwValidationError } from "../util/errorThrowers";
import { userTypes } from "../../types";

// @desc create user
// @route POST /user
// @access admin
const createNewUser = asyncHandler(
  async (
    req: Request<unknown, unknown, userTypes.TNewUserRequest>,
    res: Response<userTypes.TUserSafe>
  ) => {
    const { username, password, userlevel } = req.body;

    if (!username || !password || !userlevel) {
      throwValidationError("missing input field(s)");
    }

    const allUserlevels = await getUserlevels();

    const validatedInputLevelIds = validateUserlevelInput({
      allUserlevels,
      requestedUserlevels: userlevel,
    });

    if (!validatedInputLevelIds) {
      throwValidationError("invalid userlevel input");
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const rawUser = await User.create({ username, password: passwordHash });

    const userlevelsToSave = validatedInputLevelIds.map((id) => {
      return { userlevelId: id, userId: rawUser.id };
    });

    await UserAndlevel.bulkCreate(userlevelsToSave);

    const createdUser = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { id: rawUser.id },
      ...addUserlevels,
    });

    if (createdUser) {
      res.status(201).json(userlevelsToArray(createdUser));
    }
  }
);

// @desc delete all users except hal!!!
// @route DELETE /user
// @access hal
const deleteAllUsers = asyncHandler(async (_req, res) => {
  const hal = await User.findOne({
    attributes: { exclude: ["password"] },
    where: { username: "hal" },
  });

  if (hal) {
    await UserAndlevel.destroy({
      where: { userId: { [Op.not]: hal.id } },
    });
    await User.destroy({ where: { id: { [Op.not]: hal.id } } });
  }

  res.status(204).end();
});

// @desc delete user
// @route DELETE /user/:id
// @access admin
const deleteUser = asyncHandler(async (req, res) => {
  await UserAndlevel.destroy({
    where: { userId: req.params.id },
  });

  const destroyedUser = await User.destroy({ where: { id: req.params.id } });

  if (!destroyedUser) {
    throwNotFound(`user ${req.params.id} not destroyed`);
  }

  res.status(204).end();
});

// @desc get all users
// @route GET /user
// @access admin
const getAllUsers = asyncHandler(
  async (_req, res: Response<userTypes.TUserSafe[]>) => {
    const rawUsers = await User.findAll({
      where: { username: { [Op.not]: "hal" } },
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
    });

    const users = rawUsers
      .map((u) => userlevelsToArray(u))
      .sort((a, b) => {
        const nameA = a.username.toUpperCase();
        const nameB = b.username.toUpperCase();
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });

    res.status(200).json(users);
  }
);

// @desc get user
// @route GET /user/:id
// @access admin
const getUser = asyncHandler(
  async (req, res: Response<userTypes.TUserSafe>) => {
    const user = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { id: req.params.id },
      ...addUserlevels,
    });

    if (!user) {
      throwNotFound(`user ${req.params.id} not found`);
      return;
    }

    res.status(200).json(userlevelsToArray(user));
  }
);

// @desc update user
// @route PATCH /user/:id
// @access user/admin (all can change own password)
const updateUser = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, userTypes.TUpdateUserRequest>,
    res: Response<userTypes.TUserSafe>
  ) => {
    const id = req.params.id;

    if (!id) {
      throwValidationError("id is required");
    }

    const rawUserToUpdate = await User.findOne({ where: { id } });
    if (!rawUserToUpdate) {
      throwNotFound(`User ${id} not found`);
      return;
    }

    const userToUpdate = rawUserToUpdate.toJSON();

    if (req.body.username) userToUpdate.username = req.body.username;

    if (req.body.password)
      userToUpdate.password = await bcrypt.hash(req.body.password, 10);

    if (req.body.disabled === true || req.body.disabled === false) {
      userToUpdate.disabled = req.body.disabled;
    }

    const requestedUserlevels = req.body.userlevels;

    if (requestedUserlevels) {
      const allUserlevels = await getUserlevels();
      const validatedInputLevelIds = validateUserlevelInput({
        allUserlevels,
        requestedUserlevels,
      });
      if (!validatedInputLevelIds) {
        throwValidationError("invalid userlevel input");
        return;
      }
      await UserAndlevel.destroy({ where: { userId: id } });
      const userlevelsToSave = validatedInputLevelIds.map((levelId) => {
        return { userlevelId: levelId, userId: Number(id) };
      });
      await UserAndlevel.bulkCreate(userlevelsToSave);
    }

    await rawUserToUpdate.update(userToUpdate);
    const resUser = await User.findOne({
      attributes: { exclude: ["password"] },
      where: { id: id },
      ...addUserlevels,
    });

    if (!resUser) {
      throwNotFound("updated user not found drom db");
      return;
    }

    res.status(200).json(userlevelsToArray(resUser));
  }
);

export default {
  createNewUser,
  deleteAllUsers,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
};
