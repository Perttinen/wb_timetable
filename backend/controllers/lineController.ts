import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { Line, LineDock } from "../../database/models";
import { throwNotFound, throwValidationError } from "../util/errorThrowers";
import { dockIdsAreValid, lineIncludes } from "../util/helperFunctions";
import { createReturnableLine } from "../util/helperFunctions";
import { lineTypes } from "../../types";

// @desc create line
// @route POST /line
// @access admin
const createNewLine = asyncHandler(
  async (
    req: Request<unknown, unknown, lineTypes.TLineRequest>,
    res: Response<lineTypes.TLineResponse>
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
    }

    const createdLine = await Line.create({
      startDockId,
      endDockId,
    });

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

// @desc delete all lines and all related data!!!
// @route DELETE /line
// @access hal
const deleteAllLines = asyncHandler(async (_req: Request, res: Response) => {
  await LineDock.destroy({ where: {} });

  await Line.destroy({ where: {} });

  res.status(204).end();
});

// @desc delete line
// @route DELETE /line/:id
// @access admin
const deleteLine = asyncHandler(async (req: Request, res: Response) => {
  await LineDock.destroy({ where: { lineId: req.params.id } });

  const lineDestroyed = await Line.destroy({ where: { id: req.params.id } });

  if (!lineDestroyed) {
    throwNotFound(`line ${req.params.id} not destroyed`);
  }

  res.status(200).send(lineDestroyed);
});

// @desc get lines
// @route GET /line
// @access public
const getAllLines = asyncHandler(async (_req: Request, res: Response) => {
  const rawLines: Line[] = await Line.findAll({
    include: lineIncludes,
  });

  const lines = rawLines.map((line) => createReturnableLine(line));

  res.status(200).json(lines);
});

// @desc get line
// @route GET /line/:id
// @access user
const getLine = asyncHandler(async (req: Request, res: Response) => {
  const rawLine = await Line.findOne({
    where: { id: req.params.id },
    include: lineIncludes,
  });

  if (!rawLine) {
    throwNotFound(`line id ${req.params.id} not found`);
    return;
  }

  res.status(200).json(createReturnableLine(rawLine));
});

// @desc update line
// @route PATCH /line/:id
// @access admin
const updateLine = asyncHandler(
  async (
    req: Request<{ id: string }, unknown, lineTypes.TLineRequest>,
    res: Response<lineTypes.TLineResponse>
  ) => {
    const { startDockId, stops, endDockId } = req.body;
    const lineId = req.params.id;

    if (!startDockId || !stops || !endDockId) {
      throwValidationError(
        "required { startDockId, stops, endDockId } input values missing"
      );
    }

    if (!(await dockIdsAreValid(req.body))) {
      throwValidationError("dock ids are not valid");
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
  deleteAllLines,
  deleteLine,
  getAllLines,
  getLine,
  updateLine,
};
