// import bcrypt from "bcrypt";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
// import { Op } from "@sequelize/core";

import { ILine, IStop } from "../../types";
import { INTEGER } from "@sequelize/core/lib/abstract-dialect/data-types";
import { Dock, Line, LineDock } from "../../database/models";
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

// interface IAddableLine {
//   startDockId: INTEGER;
//   endDockId: INTEGER;
// }

// interface IStop {
//   id: INTEGER;
//   dockId: INTEGER;
//   delayFromStart: INTEGER;
// }

// interface ILine {
//   id: INTEGER;
//   startDockId: INTEGER;
//   endDockId: INTEGER;
//   stops: IStop[];
// }

// interface IStopToAdd {
//   lineId: INTEGER;
//   dockId: INTEGER;
//   delayFromStart: INTEGER;
// }

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
      console.log("line: ", createdLine);

      res.status(201).json(createdLine);
    } else {
      res.status(400).end();
    }
  }
);

// const createManyLines = asyncHandler(
//   async (req: Request<unknown, unknown, ILineToAdd[]>, res: Response) => {
//     const lines = req.body
//     let stopsToAdd:IStopToAdd[] = []
//     let linesToAdd: IAddableLine[] = []
//     for(const l of lines ){
//       linesToAdd.push({startDockId: l.startDockId, endDockId: l.endDockId})
//       if(l.stops.length > 0){

//       }
//     }

//     res.status(201).end()
//   }
// );

const deleteAllLines = asyncHandler(async (_req: Request, res: Response) => {
  await LineDock.destroy({ where: {} });
  await Line.destroy({ where: {} });
  res.status(204).end();
});

const deleteLine = asyncHandler((_req: Request, res: Response) => {
  res.status(204).end();
});

const getAllLines = asyncHandler(async (_req: Request, res: Response) => {
  const lines: ILine[] = (
    await Line.findAll({
      include: [
        {
          model: Dock,
          attributes: ["name", "id"],
          through: {
            attributes: ["delayFromStart"],
          },
        },
      ],
    })
  ).map((d) => d.toJSON());
  res.status(200).json(lines);
});

const getLine = asyncHandler((_req: Request, res: Response) => {
  res.status(200).end();
});

const updateLine = asyncHandler(
  (_req: Request<unknown, unknown, ILineToAdd>, res: Response) => {
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
