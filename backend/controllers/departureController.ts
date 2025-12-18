import { Request, Response } from "express"
import asyncHandler from "express-async-handler"
import { Op } from "@sequelize/core"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import utc from "dayjs/plugin/utc"
import isBetween from "dayjs/plugin/isBetween"

import { Departure, Dock, Line } from "../../database/models"
import { throwNotFound, throwValidationError } from "../util/errorThrowers"
import { formatLines } from "../util/helperFunctions"
import { departureTypes } from "../../types"

dayjs.extend(customParseFormat)
dayjs.extend(utc)
dayjs.extend(isBetween)

// @desc create
// @route POST /departure/addone
// @access user
const createDeparture = asyncHandler(
  async (
    req: Request<unknown, unknown, departureTypes.TInputDeparture>,
    res: Response<departureTypes.TDeparture>
  ) => {
    const { lineId, start } = req.body

    if (!lineId || !start) {
      throwValidationError("lineId and start are required")
    }
    const response = await Departure.create({ lineId, start })

    res.status(201).json(response)
  }
)

// @desc createMany
// @route POST /departure/addmany
// @access user
const createManyDepartures = asyncHandler(
  async (
    req: Request<unknown, unknown, departureTypes.TInputDeparture[]>,
    res: Response<departureTypes.TDeparture[]>
  ) => {
    const departures = req.body

    const response = await Departure.bulkCreate(departures)

    res.status(201).json(response)
  }
)

// @desc deleteMany
// @route DELETE /departure/deletemany
// @access user
const deleteDepartures = asyncHandler(
  async (
    req: Request<unknown, unknown, departureTypes.TDeleteDeparturesPayload>,
    res
  ) => {
    const { lineId, fromDate, toDate, fromTime, toTime, weekdays } = req.body

    if (!lineId || !fromDate || !toDate || !fromTime || !toTime || !weekdays) {
      throwValidationError("Missing required fields")
    }

    const getMinutes = (time: string) => {
      const splitted = time.split(":")
      return Number(splitted[0]) * 60 + Number(splitted[1])
    }

    const fromMinutes = getMinutes(fromTime)
    const toMinutes = getMinutes(toTime)

    if (fromMinutes > toMinutes) {
      throwValidationError("From time can't be greater than To time!")
    }

    const fromDateTime = dayjs(`${fromDate}T${fromTime}`)
    const toDateTime = dayjs(`${toDate}T${toTime}`).add(1, "minute")

    const rawDepartures = await Departure.findAll({
      where: {
        lineId,
        start: {
          [Op.between]: [fromDateTime.toDate(), toDateTime.toDate()],
        },
      },
    })

    const filteredDepartures = rawDepartures.filter((departure) => {
      const start = dayjs(departure.start)
      const startMinutes = start.hour() * 60 + start.minute()

      return (
        startMinutes >= fromMinutes &&
        startMinutes <= toMinutes &&
        weekdays[dayjs(departure.start).subtract(1, "day").day()]
      )
    })

    // console.log("filteredDepartures: ", filteredDepartures)

    const departureIdsToDelete = filteredDepartures.map(
      (departure) => departure.id
    )

    const deletedCount = await Departure.destroy({
      where: {
        id: {
          [Op.in]: departureIdsToDelete,
        },
      },
    })

    res.status(200).json(deletedCount)
  }
)

// @desc getAll
// @route GET /departure
// @access user
const getAllDepartures = asyncHandler(async (_req: Request, res: Response) => {
  const departures = (await Departure.findAll({})).map((d) => d.toJSON())

  res.status(200).json(departures)
})

// @desc getByLineId
// @route POST /departure/byLine/:lineId
// @access user
const getDeparturesByLineId = asyncHandler(
  async (req: Request, res: Response) => {
    const lineId = req.params.lineId
    const departures: Departure[] = (
      await Departure.findAll({
        where: { lineId },
      })
    ).map((d) => d.toJSON())
    res.status(200).json(departures)
  }
)

// @desc get20NextByDockId
// @route GET /departure/timetable/:dockId
// @access public
const get20DeparturesByDockId = asyncHandler(
  async (
    req: Request,
    res: Response<departureTypes.TDepartureForTimetable[]>
  ) => {
    const rawDock = await Dock.findOne({
      where: { id: req.params.dockId },
    })

    if (!rawDock) {
      throwNotFound(`dock name ${req.params.dockName} not found in db`)
      return
    }

    const rawLines = await Line.findAll({
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

    const formattedLines = formatLines({ lines: rawLines, dockId: rawDock.id })

    const relatedLineIds = formattedLines.map((line) => line.lineId)

    const lineMap = new Map(formattedLines.map((line) => [line.lineId, line]))

    const rawDepartures = await Departure.findAll({
      where: { lineId: relatedLineIds },
      order: [["start", "ASC"]] as [["start", "ASC"]],
    })

    const dockDepartures = rawDepartures.map((departure) => {
      const line = lineMap.get(departure.lineId)
      if (!line) {
        throw new Error(
          `Something went wrong with lines and departures ${departure.lineId}, ${departure.id}`
        )
      }
      const startTime = new Date(departure.start)
      startTime.setMinutes(startTime.getMinutes() + line.delay)
      return {
        destination: line.endDock,
        startTime,
        via: line.via,
      }
    })

    const upcomingDepartures = dockDepartures
      .filter((departure) => departure.startTime.getTime() > Date.now())
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime())
      .slice(0, 20)

    res.status(200).json(upcomingDepartures)
  }
)

export default {
  createDeparture,
  createManyDepartures,
  deleteDepartures,
  get20DeparturesByDockId,
  getAllDepartures,
  getDeparturesByLineId,
}
