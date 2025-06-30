import { INTEGER } from "@sequelize/core/lib/abstract-dialect/data-types";
import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Departure, Dock, Line } from "../../database/models";
import { IBigLine, IDeparture, IFormattedLine } from "../../types";

interface IInputDeparture {
  lineId: INTEGER;
  start: Date;
}

interface IFormatLinesEntry {
  lines: IBigLine[];
  dockId: number;
}

const formatLines = (input: IFormatLinesEntry): IFormattedLine[] => {
  const { lines, dockId } = input;
  const formattedLines = [];
  for (const line of lines) {
    line.docks.sort(
      (a, b) => a.lineDock.delayFromStart - b.lineDock.delayFromStart
    );
    const dockInDocks = line.docks.find((d) => d.id === dockId);
    if (dockInDocks || line.startDock.id === dockId) {
      if (line.startDock.id === dockId) {
        formattedLines.push({
          lineId: line.id,
          endDock: line.endDock.name,
          delay: 0,
          via: line.docks.map((dock) => dock.name),
        });
      } else {
        if (!dockInDocks) {
          throw new Error(`Dock not found`);
        }
        const dockInDocksIndex = line.docks.indexOf(dockInDocks);
        const delay = dockInDocks.lineDock.delayFromStart;
        const via = line.docks
          .filter((d, i: number) => {
            if (i > dockInDocksIndex) {
              return d.name;
            } else return;
          })
          .map((d) => d.name);
        formattedLines.push({
          lineId: line.id,
          endDock: line.endDock.name,
          delay,
          via,
        });
      }
    }
  }
  return formattedLines;
};

const createDeparture = asyncHandler(
  async (req: Request<unknown, unknown, IInputDeparture>, res: Response) => {
    const { lineId, start } = req.body;
    const response = await Departure.create({ lineId, start });
    res.status(200).json(response);
  }
);

const getAllDepartures = asyncHandler(async (_req: Request, res: Response) => {
  const departures: Departure[] = (await Departure.findAll({})).map((d) =>
    d.toJSON()
  );
  res.status(200).json(departures);
});

const getAllDeparturesByDockId = asyncHandler(
  async (req: Request, res: Response) => {
    const dockId = parseInt(req.params.id);

    const lines: IBigLine[] = (
      await Line.findAll({
        attributes: { exclude: ["startDockId", "endDockId"] },
        include: [
          { model: Dock, as: "startDock", attributes: ["name", "id"] },
          { model: Dock, as: "endDock", attributes: ["id", "name"] },
          {
            model: Dock,
            attributes: ["name", "id"],
            through: { attributes: ["delayFromStart"] },
          },
        ],
      })
    ).map((lines) => lines.toJSON());

    const formattedLines = formatLines({ lines, dockId });

    const relatedLines = formattedLines.map((line) => line.lineId);

    const relatedDepartures: IDeparture[] = (
      await Departure.findAll({ where: { lineId: relatedLines } })
    ).map((d) => d.toJSON());

    const dockDepartures = [];
    for (const departure of relatedDepartures) {
      for (const l of formattedLines) {
        if (departure.lineId === l.lineId) {
          dockDepartures.push({
            destination: l.endDock,
            startTime: new Date(
              departure.start.setMinutes(departure.start.getMinutes() + l.delay)
            ),
            via: l.via,
          });
        }
      }
    }
    res.status(200).json(dockDepartures);
  }
);

export default {
  createDeparture,
  getAllDepartures,
  getAllDeparturesByDockId,
};
