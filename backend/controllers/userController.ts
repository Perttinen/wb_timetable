import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Op } from "@sequelize/core";

import {
  IJsonUser,
  IJsonUserFlattenedLevels,
  IJsonUserFromDbNoLevels,
  IJsonUserPw,
  INewUserRequest,
  IUpdateUserInput,
  IUserlevel,
} from "../../types";
import { User, UserAndlevel, Userlevel } from "../../database/models";
import { addUserlevels } from "./commonFuncs";
import { throwNotFound, throwValidationError } from "../util/errorThrowers";

// Converts User object to json and flattens User.userlevels to array.

const userlevelsToArray = (user: User): IJsonUserFlattenedLevels => {
  const jsonUser: IJsonUser = user.toJSON();
  let userlevelsToReturn: { userlevel: string }[];
  if (jsonUser.userlevels) {
    userlevelsToReturn = jsonUser.userlevels;
  } else {
    userlevelsToReturn = [];
  }
  return {
    ...jsonUser,
    userlevels: userlevelsToReturn.map(({ userlevel }) => userlevel),
  };
};

const getUserlevels = async (): Promise<IUserlevel[]> => {
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
}): number[] | null => {
  const inputLevels = userlevel;
  const validatedInputLevelIds = allUserlevels
    .filter(({ userlevel }) => inputLevels.includes(userlevel))
    .map(({ id }) => id);
  if (
    userlevel.length !== validatedInputLevelIds.length ||
    validatedInputLevelIds.length === 0
  )
    return null;
  return validatedInputLevelIds;
};

const createNewUser = asyncHandler(
  async (
    req: Request<unknown, unknown, INewUserRequest>,
    res: Response<IJsonUserFlattenedLevels>
  ) => {
    const { username, password, userlevel } = req.body;

    // Check required fields existence
    if (!username || !password || !userlevel) {
      throwValidationError("missing input field(s)");
      return;
    }

    // Validate input userlevels
    const allUserlevels = await getUserlevels();
    const validatedInputLevelIds = validateUserlevelInput({
      allUserlevels,
      userlevel,
    });
    if (!validatedInputLevelIds) {
      throwValidationError("invalid userlevel input");
      return;
    }

    // create new user
    const passwordHash = await bcrypt.hash(password, 10);
    const dbUser = await User.create({ username, password: passwordHash });
    const newUser: IJsonUserPw = dbUser.toJSON();

    // add users userlevels to user_and_levels junction table
    const userlevelsToSave = validatedInputLevelIds.map((id) => {
      return { userlevelId: id, userId: newUser.id };
    });
    await UserAndlevel.bulkCreate(userlevelsToSave);

    // get created user from db and response with it
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

// for test purposes only
const deleteAllUsers = asyncHandler(async (_req, res) => {
  // deletes all users and related data (user_and_levels) from db
  const hal = await User.findOne({
    attributes: { exclude: ["password"] },
    where: { username: "hal" },
  });
  if (hal) {
    const jsonHal: IJsonUserFromDbNoLevels = hal.toJSON();
    await UserAndlevel.destroy({
      where: { userId: { [Op.not]: jsonHal.id } },
    });
    await User.destroy({ where: { id: { [Op.not]: jsonHal.id } } });
  }
  res.status(204).end();
});

const deleteUser = asyncHandler(async (req, res) => {
  await UserAndlevel.destroy({
    where: { userId: req.params.id },
  });
  const destroyedUsers = await User.destroy({ where: { id: req.params.id } });
  if (!destroyedUsers) {
    throwNotFound(`user ${req.params.id} not destroyed`);
    return;
  }
  res.status(204).end();
});

const getAllUsers = asyncHandler(
  async (_req, res: Response<IJsonUserFlattenedLevels[]>) => {
    // get all users but hal
    const users = await User.findAll({
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
    // response json users with userlevelIds flattened
    res.status(200).json(users.map((u) => userlevelsToArray(u)));
  }
);

const getUser = asyncHandler(
  async (req, res: Response<IJsonUserFlattenedLevels>) => {
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

const updateUser = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, IUpdateUserInput>,
    res: Response<IJsonUserFlattenedLevels>
  ) => {
    const id = req.params.id;
    // Check required fields existence
    if (!id) {
      throwValidationError("id is required");
      return;
    }
    // get user to update and format to json
    const userToUpdateDb = await User.findOne({ where: { id } });
    if (!userToUpdateDb) {
      throwNotFound(`User ${id} not found`);
      return;
    }
    const updateUser: IJsonUserPw = userToUpdateDb.toJSON();
    // check if properties to update in req.body. Change in updateUser if needed.
    if (req.body.username) updateUser.username = req.body.username;
    if (req.body.password)
      updateUser.password = await bcrypt.hash(req.body.password, 10);
    if (req.body.disabled === true || req.body.disabled === false) {
      updateUser.disabled = req.body.disabled;
    }
    const userlevel = req.body.userlevels;
    if (userlevel) {
      const allUserlevels = await getUserlevels();
      const validatedInputLevelIds = validateUserlevelInput({
        allUserlevels,
        userlevel,
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
    // Update original user, get proper user from db and response with it
    await userToUpdateDb.update(updateUser);
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
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteAllUsers,
};
