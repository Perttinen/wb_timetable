import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { Departure, Dock, Line } from "../../database/models";
import {
  IBigLine,
  IDeparture,
  IDepartureForTimetable,
  IDock,
  IFormattedLine,
  IInputDeparture,
} from "../../types";
import { throwNotFound, throwValidationError } from "../util/errorThrowers";
import { Op } from "@sequelize/core";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { IDeleteDeparturesPayload } from "../../types";

dayjs.extend(customParseFormat);

interface IFormatLinesEntry {
  lines: IBigLine[];
  dockId: number;
}

const formatLines = (input: IFormatLinesEntry): IFormattedLine[] => {
  const { lines, dockId } = input;

  const formattedLines = [];
  for (const line of lines) {
    if (line.docks && line.startDock && line.endDock) {
      line.docks.sort(
        (a, b) => a.lineDock.delayFromStart - b.lineDock.delayFromStart
      );

      const isStartDock = line.startDock.id === dockId;
      const dockInDocks = line.docks.find((d) => d.id === dockId);

      if (!isStartDock && !dockInDocks) continue;

      const delay = isStartDock ? 0 : dockInDocks!.lineDock.delayFromStart;

      const via = isStartDock
        ? line.docks.map((dock) => dock.name)
        : line.docks
            .slice(line.docks.indexOf(dockInDocks!) + 1)
            .map((dock) => dock.name);
      formattedLines.push({
        lineId: line.id,
        endDock: line.endDock.name,
        delay,
        via,
      });
    }
  }
  return formattedLines;
};

const deleteDepartures = asyncHandler(
  async (req: Request<unknown, unknown, IDeleteDeparturesPayload>, res) => {
    const { lineId, fromDate, toDate, fromTime, toTime, weekdays } = req.body;

    const fromDateTime = dayjs(`${fromDate}T${fromTime}`);
    const toDateTime = dayjs(`${toDate}T${toTime}`);

    const departures = await Departure.findAll({
      where: {
        lineId,
        start: {
          [Op.between]: [fromDateTime.toDate(), toDateTime.toDate()],
        },
      },
    });

    const filtered = departures.filter((d) => {
      const start = dayjs(d.start);
      const minutes = start.hour() * 60 + start.minute();
      const fromMinutes =
        dayjs(fromTime, "HH:mm").hour() * 60 +
        dayjs(fromTime, "HH:mm").minute();
      const toMinutes =
        dayjs(toTime, "HH:mm").hour() * 60 + dayjs(toTime, "HH:mm").minute();
      const weekdayIndex = (start.day() + 6) % 7;
      return (
        minutes >= fromMinutes && minutes <= toMinutes && weekdays[weekdayIndex]
      );
    });

    console.log(
      "filtered: ",
      filtered.map((f) => f.dataValues)
    );

    const idsToDelete = filtered.map((d) => d.id);

    const deleted = await Departure.destroy({
      where: {
        id: {
          [Op.in]: idsToDelete,
        },
      },
    });

    res.status(200).json(deleted);
  }
);

const createDeparture = asyncHandler(
  async (
    req: Request<unknown, unknown, IInputDeparture>,
    res: Response<IDeparture>
  ) => {
    const { lineId, start } = req.body;
    if (!lineId || !start) {
      throwValidationError("lineId and start are required");
      return;
    }
    const response = await Departure.create({ lineId, start });
    res.status(200).json(response);
  }
);

const createManyDepartures = asyncHandler(
  async (
    req: Request<unknown, unknown, IInputDeparture[]>,
    res: Response<IDeparture[]>
  ) => {
    const departures = req.body;

    const response = await Departure.bulkCreate(departures);
    res.status(200).json(response);
  }
);

const getAllDepartures = asyncHandler(async (_req: Request, res: Response) => {
  const departures: Departure[] = (await Departure.findAll({})).map((d) =>
    d.toJSON()
  );
  res.status(200).json(departures);
});

const getDeparturesByLineId = asyncHandler(
  async (req: Request, res: Response) => {
    const lineId = req.params.lineId;
    const departures: Departure[] = (
      await Departure.findAll({
        where: { lineId },
      })
    ).map((d) => d.toJSON());
    res.status(200).json(departures);
  }
);

const get20DeparturesByDockName = asyncHandler(
  async (req: Request, res: Response<IDepartureForTimetable[]>) => {
    const dockDb = await Dock.findOne({
      where: { id: req.params.dockId },
    });
    if (!dockDb) {
      throwNotFound(`dock name ${req.params.dockName} not found in db`);
      return;
    }
    const dock: IDock = dockDb.toJSON();
    const dockId = dock.id;

    const lines: IBigLine[] = (
      await Line.findAll({
        attributes: { exclude: ["startDockId", "endDockId"] },
        include: [
          {
            association: "startDock",
            attributes: ["id", "name"],
          },
          {
            association: "endDock",
            attributes: ["id", "name"],
          },
          {
            association: "docks",
            attributes: ["id", "name"],
            through: {
              attributes: ["delayFromStart"],
            },
          },
        ],
      })
    ).map((lines) => lines.toJSON());

    const formattedLines = formatLines({ lines, dockId });

    const relatedLineIds = formattedLines.map((line) => line.lineId);

    const relatedDeparturesDb: Departure[] = await Departure.findAll({
      where: { lineId: relatedLineIds },
      order: [["start", "ASC"]] as [["start", "ASC"]],
    });

    const relatedDepartures: IDeparture[] = relatedDeparturesDb.map((d) =>
      d.toJSON()
    );

    const lineMap = new Map(formattedLines.map((line) => [line.lineId, line]));

    const dockDepartures = relatedDepartures.map((departure) => {
      const line = lineMap.get(departure.lineId);
      if (!line) {
        throw new Error(
          `Something went wrong with lines and departures ${departure.lineId}, ${departure.id}`
        );
      }
      const startTime = new Date(departure.start);
      startTime.setMinutes(startTime.getMinutes() + line.delay);
      return {
        destination: line.endDock,
        startTime,
        via: line.via,
      };
    });
    const upcomingDepartures = dockDepartures.filter(
      (departure) => departure.startTime > new Date(Date.now())
    );

    res
      .status(200)
      .json(
        upcomingDepartures
          .slice(0, 20)
          .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      );
  }
);

export default {
  createDeparture,
  createManyDepartures,
  getAllDepartures,
  get20DeparturesByDockName,
  getDeparturesByLineId,
  deleteDepartures,
};
