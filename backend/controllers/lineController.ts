// import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
// import { Op } from "@sequelize/core";

import {} from "../../types";
import { INTEGER } from "@sequelize/core/lib/abstract-dialect/data-types";
import { Line, LineDock } from "../../database/models";
// import { User, UserAndlevel, Userlevel } from "../../database/models";
// import { addUserlevels } from "./commonFuncs";

// Converts User object to json and User.userlevels to array.
// const userlevelsToArray = (user: User) => {
//   const jsonUser: IJsonUser = user.toJSON();
//   const returnUser = {
//     ...jsonUser,
//     userlevels: jsonUser.userlevels.map((ul) => ul.userlevel),
//   };
//   return returnUser;
// };

// const getUserlevels = async () => {
//   const userlevels: IUserlevel[] = (await Userlevel.findAll()).map((ul) =>
//     ul.toJSON()
//   );
//   return userlevels;
// };

// const validateUserlevelInput = ({
//   userlevel,
//   allUserlevels,
// }: {
//   userlevel: string[];
//   allUserlevels: IUserlevel[];
// }): number[] => {
//   const uniqueInputLevels = userlevel.filter(
//     (value: string, index: number, array: string[]) =>
//       array.indexOf(value) === index
//   );
//   const validatedInputLevelIds = allUserlevels
//     .filter((ul) => uniqueInputLevels.includes(ul.userlevel))
//     .map((ul) => ul.id);
//   if (userlevel.length !== validatedInputLevelIds.length) return [];
//   return validatedInputLevelIds;
// };

interface ILineToAdd {
  startDockId: INTEGER;
  stops: { dockId: INTEGER; delayFromStart: INTEGER }[];
  endDockId: INTEGER;
}

interface IStop {
  id: INTEGER;
  dockId: INTEGER;
  delayFromStart: INTEGER;
}

interface ILine {
  id: INTEGER;
  startDockId: INTEGER;
  endDockId: INTEGER;
  stops?: IStop[];
}

const createNewLine = asyncHandler(
  async (req: Request<unknown, unknown, ILineToAdd>, res: Response) => {
    const { startDockId, stops, endDockId } = req.body;
    const createdLine: ILine = (
      await Line.create({
        startDockId,
        endDockId,
      })
    ).toJSON();
    if (stops.length > 0) {
      const stopsToAdd = stops.map((s) => ({
        ...s,
        lineId: createdLine.id,
      }));
      const addedStops: IStop[] = (await LineDock.bulkCreate(stopsToAdd)).map(
        (ld) => ld.toJSON()
      );
      createdLine.stops = addedStops.map((s) => ({
        id: s.id,
        dockId: s.dockId,
        delayFromStart: s.delayFromStart,
      }));
    }
    if (createdLine) {
      res.status(201).json(createdLine);
    } else {
      res.status(400).end();
    }
  }
);

const deleteAllLines = asyncHandler(async (_req: Request, res: Response) => {
  await LineDock.destroy({ where: {} });
  await Line.destroy({ where: {} });
  res.status(204).end();
});

const deleteLine = asyncHandler(
  // async
  (_req: Request, res: Response) => {
    //   await UserAndlevel.destroy({
    //     where: { userId: req.params.id },
    //   });
    //   await User.destroy({ where: { id: req.params.id } });
    res.status(204).end();
  }
);

const getAllLines = asyncHandler(
  // async
  (_req: Request, res: Response) => {
    //   const users = await User.findAll({
    //     attributes: { exclude: ["password"] },
    //     ...addUserlevels,
    //   });

    //   const resUsers = users.map((u) => userlevelsToArray(u));
    //   if (users) res.status(200).json(resUsers);
    res.status(200).end();
  }
);

const getLine = asyncHandler(
  // async
  (_req: Request, res: Response) => {
    //   const user = await User.findOne({
    //     attributes: { exclude: ["password"] },
    //     where: { id: req.params.id },
    //     ...addUserlevels,
    //   });
    //   if (user) {
    //     res.status(200).json(userlevelsToArray(user));
    //   } else {
    //     res.status(404).end();
    //   }
    res.status(200).end();
  }
);

const updateLine = asyncHandler(
  // async
  (_req: Request<unknown, unknown, ILineToAdd>, res: Response) => {
    // const id = req.body.id;
    // const userToUpdate = await User.findOne({ where: { id } });
    // if (!userToUpdate) {
    //   res.status(400).json({ message: "User not found" });
    //   return;
    // }
    // const jsonUser: IJsonUserPw = userToUpdate.toJSON();
    // if (req.body.username) jsonUser.username = req.body.username;
    // if (req.body.password)
    //   jsonUser.password = await bcrypt.hash(req.body.password, 10);
    // if (req.body.disabled === true || req.body.disabled === false) {
    //   jsonUser.disabled = req.body.disabled;
    // }
    // const userlevel = req.body.userlevels;
    // if (userlevel) {
    //   const allUserlevels = await getUserlevels();
    //   const validatedInputLevelIds = validateUserlevelInput({
    //     allUserlevels,
    //     userlevel,
    //   });
    //   if (
    //     validatedInputLevelIds.length > 0 &&
    //     validatedInputLevelIds.length === userlevel.length
    //   ) {
    //     await UserAndlevel.destroy({ where: { userId: id } });
    //     const userlevelsToSave = validatedInputLevelIds.map((ul) => {
    //       return { userlevelId: ul, userId: id };
    //     });
    //     await UserAndlevel.bulkCreate(userlevelsToSave);
    //   } else {
    //     res.status(406).json({ message: "Userlevels array is not valid" });
    //   }
    // }
    // await userToUpdate.update(jsonUser);
    // const user = await User.findOne({
    //   attributes: { exclude: ["password"] },
    //   where: { id: id },
    //   ...addUserlevels,
    // });
    // if (user) {
    //   res.status(200).json(userlevelsToArray(user));
    // } else {
    //   res.status(404).end();
    // }
    res.status(200).end();
  }
);

export default {
  createNewLine,
  deleteLine,
  getAllLines,
  getLine,
  updateLine,
  deleteAllLines,
};
