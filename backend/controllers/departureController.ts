import { INTEGER } from "@sequelize/core/lib/abstract-dialect/data-types";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Departure } from "../../database/models";

// import { Departure } from "../../database/models";

// import {
// //   Dock,
// //   Line,
// //   LineDock,
//   // , Line, LineDock
// } from "../../database/models";

interface IInputDeparture {
  lineId: INTEGER;
  start: Date;
}

const createDeparture = asyncHandler(
  async (req: Request<unknown, unknown, IInputDeparture>, res: Response) => {
    const { lineId, start } = req.body;
    const response = await Departure.create({ lineId, start });
    res.status(200).json(response);
  }
);

// const createManyDocks = asyncHandler(
//   async (req: Request<unknown, unknown, { name: string }[]>, res: Response) => {
//     const createdDocks = (await Dock.bulkCreate(req.body)).map((d) =>
//       d.toJSON()
//     );
//     res.status(201).json(createdDocks);
//   }
// );

// const deleteDock = asyncHandler(async (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   await Dock.destroy({ where: { id } });
//   res.status(204).end();
// });

// const getAllDocks = asyncHandler(async (_req: Request, res: Response) => {
//   const docks: IDock[] = (await Dock.findAll({})).map((d) => d.toJSON());
//   res.status(200).json(docks);
// });

// const getDock = asyncHandler(async (req: Request, res: Response) => {
//   const id = Number(req.params.id);
//   const dock = await Dock.findByPk(id);
//   if (dock) {
//     res.status(200).json(dock);
//   } else {
//     res.status(404).end();
//   }
// });

// const updateDock = asyncHandler(
//   async (req: Request<unknown, unknown, IDock>, res: Response) => {
//     const id = Number(req.body.id);
//     const dockToUpdate = await Dock.findByPk(id);
//     if (dockToUpdate) {
//       await dockToUpdate.update({ name: req.body.name });
//       res.status(200).json(req.body);
//     } else {
//       res.status(404).end();
//     }
//   }
// );

// const deleteAllDocks = asyncHandler(async (_req: Request, res: Response) => {
//   await LineDock.destroy({ where: {} });
//   await Line.destroy({ where: {} });
//   await Dock.destroy({ where: {} });
//   res.status(204).end();
// });

export default {
  createDeparture,
  //   deleteDock,
  //   getAllDocks,
  //   getDock,
  //   updateDock,
  //   deleteAllDocks,
  //   createManyDocks,
};
