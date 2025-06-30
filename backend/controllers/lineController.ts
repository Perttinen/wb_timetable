import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { ILine, IStop } from "../../types";
import { INTEGER } from "@sequelize/core/lib/abstract-dialect/data-types";
import { Dock, Line, LineDock } from "../../database/models";

interface ILineToAdd {
  startDockId: INTEGER;
  stops: { dockId: INTEGER; delayFromStart: INTEGER }[];
  endDockId: INTEGER;
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
