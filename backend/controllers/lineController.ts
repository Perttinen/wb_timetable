import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { IDock, ILine, ILineReturnable, ILineToAdd } from "../../types";
import { Dock, Line, LineDock } from "../../database/models";
import { throwNotFound, throwValidationError } from "../util/errorThrowers";
import { lineIncludes } from "./commonFuncs";
import { createReturnableLine } from "./commonFuncs";

const dockIdsAreValid = async (line: ILineToAdd): Promise<boolean> => {
  const idsToValidate = [
    line.startDockId,
    line.endDockId,
    ...line.stops.map(({ dockId }) => dockId),
  ];
  const validDocks = await Dock.findAll();
  const validDockIds: number[] = validDocks.map((dock) => {
    const dockJson: IDock = dock.toJSON();
    return dockJson.id;
  });
  return idsToValidate.every((id) => validDockIds.includes(id));
};

const createNewLine = asyncHandler(
  async (
    req: Request<unknown, unknown, ILineToAdd>,
    res: Response<ILineReturnable>
  ) => {
    const { startDockId, stops, endDockId } = req.body;

    if (!startDockId || !stops || !endDockId) {
      throwValidationError(
        "required { startDockId, stops, endDockId } input values missing"
      );
      return;
    }

    if (!(await dockIdsAreValid(req.body))) {
      throwValidationError("dock ids are not valid");
      return;
    }

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
      await LineDock.bulkCreate(stopsToAdd);
    }

    const newLine = await Line.findOne({
      where: { id: createdLine.id },
      include: lineIncludes,
    });
    if (!newLine) {
      throwNotFound("line to create not found in db");
      return;
    }
    const lineToReturn = createReturnableLine(newLine);
    if (!lineToReturn) {
      throwNotFound(`created line id ${newLine.id} not found`);
      return;
    }
    res.status(201).json(lineToReturn);
  }
);

// for testing only
const deleteAllLines = asyncHandler(async (_req: Request, res: Response) => {
  await LineDock.destroy({ where: {} });
  await Line.destroy({ where: {} });
  res.status(204).end();
});

const deleteLine = asyncHandler(async (req: Request, res: Response) => {
  await LineDock.destroy({ where: { lineId: req.params.id } });
  const lineDestroyed = await Line.destroy({ where: { id: req.params.id } });
  if (!lineDestroyed) {
    throwNotFound(`line ${req.params.id} not destroyed`);
    return;
  }
  res.status(204).send(lineDestroyed);
});

const getAllLines = asyncHandler(async (_req: Request, res: Response) => {
  const linesDb: Line[] = await Line.findAll({
    include: lineIncludes,
  });

  res.status(200).json(linesDb.map((line) => createReturnableLine(line)));
});

const getLine = asyncHandler(async (req: Request, res: Response) => {
  const lineDb = await Line.findOne({
    where: { id: req.params.id },
    include: lineIncludes,
  });
  if (!lineDb) {
    throwNotFound(`line id ${req.params.id} not found`);
    return;
  }
  res.status(200).json(createReturnableLine(lineDb));
});

const updateLine = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, ILineToAdd>,
    res: Response<ILineReturnable>
  ) => {
    const { startDockId, stops, endDockId } = req.body;
    const lineId = req.params.id;
    if (!startDockId || !stops || !endDockId) {
      throwValidationError(
        "required { startDockId, stops, endDockId } input values missing"
      );
      return;
    }
    if (!(await dockIdsAreValid(req.body))) {
      throwValidationError("dock ids are not valid");
      return;
    }
    const lineToUpdate = await Line.findByPk(lineId);

    if (!lineToUpdate) {
      throwNotFound(`line ${lineId} not found`);
      return;
    }
    await LineDock.destroy({ where: { lineId } });
    await lineToUpdate.update({ startDockId, endDockId });
    const lineDocksToAdd = stops.map(({ dockId, delayFromStart }) => ({
      dockId,
      lineId: Number(lineId),
      delayFromStart,
    }));
    await LineDock.bulkCreate(lineDocksToAdd);
    const updatedLine = await Line.findOne({
      where: { id: lineId },
      include: lineIncludes,
    });
    if (!updatedLine) {
      throwNotFound(`updated line ${lineId} was not found after update`);
      return;
    }
    const lineToReturn = createReturnableLine(updatedLine);

    if (!lineToReturn) {
      throwNotFound(`updated line ${lineId} not found from db`);
      return;
    }

    res.status(200).json(lineToReturn);
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
