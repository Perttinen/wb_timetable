import { Request, Response } from "express";
import asyncHandler from "express-async-handler";

import { Departure, Dock, Line, LineDock } from "../../database/models";
import { dockTypes } from "../../types";
import { throwNotFound, throwValidationError } from "../util/errorThrowers";

// @desc create dock
// @route POST /dock
// @access admin
const createNewDock = asyncHandler(
  async (
    req: Request<unknown, unknown, { name: string }>,
    res: Response<dockTypes.TDock>
  ) => {
    const { name } = req.body;

    if (!name) {
      throwValidationError("required { name } input value missing");
    }

    const newDock = (await Dock.create({ name })).toJSON();

    res.status(201).json(newDock);
  }
);

// @desc delete all docks and all related data!!!
// @route DELETE /dock/
// @access hal
const deleteAllDocks = asyncHandler(async (_req, res) => {
  await Departure.destroy({ where: {} });

  await LineDock.destroy({ where: {} });

  await Line.destroy({ where: {} });

  await Dock.destroy({ where: {} });

  res.status(204).end();
});

// @desc delete dock
// @route DELETE /dock/:id
// @access admin
const deleteDock = asyncHandler(async (req, res) => {
  const id = Number(req.params.id);

  const destroyedDock = await Dock.destroy({ where: { id } });

  if (!destroyedDock) {
    throwNotFound("nothing deleted");
    return;
  }

  res.status(200).json(destroyedDock);
});

// @desc get docks
// @route GET /dock
// @access public
const getAllDocks = asyncHandler(
  async (_req, res: Response<dockTypes.TDock[]>) => {
    const rawDocks = await Dock.findAll({});

    const docks = rawDocks.sort((a, b) => {
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });

    res.status(200).json(docks);
  }
);

// @desc get dock
// @route GET /dock/:id
// @access public
const getDock = asyncHandler(async (req, res: Response<dockTypes.TDock>) => {
  const id = req.params.id;

  const dock = await Dock.findByPk(id);

  if (!dock) {
    throwNotFound(`dock ${id} not found`);
    return;
  }

  res.status(200).json(dock);
});

// @desc update dock
// @route PATCH /dock/
// @access admin
const updateDock = asyncHandler(
  async (
    req: Request<unknown, unknown, dockTypes.TDock>,
    res: Response<dockTypes.TDock>
  ) => {
    const { id, name } = req.body;

    if (!id || !name) {
      throwValidationError("required { id, name } input value missing");
    }

    const dock = await Dock.findByPk(id);

    if (!dock) {
      throwNotFound(`dock id ${id} not found`);
      return;
    }

    const updatedDock = await dock.update({ name });

    res.status(200).json(updatedDock.toJSON());
  }
);

export default {
  createNewDock,
  deleteAllDocks,
  deleteDock,
  getAllDocks,
  getDock,
  updateDock,
};
