import { Dock, Line, User, Userlevel } from "../../database/models"

import { lineTypes, userTypes, userlevelTypes } from "../../types"
import { throwValidationError } from "./errorThrowers"

export const getUserlevels = async (): Promise<userlevelTypes.TUserlevel[]> =>
  (await Userlevel.findAll()).map((ul) => ul.toJSON())

export const validateUserlevelInput = ({
  requestedUserlevels,
  allUserlevels,
}: {
  requestedUserlevels: string[]
  allUserlevels: userlevelTypes.TUserlevel[]
}): number[] => {
  const requestedSet = new Set(requestedUserlevels)

  const validatedIds = allUserlevels
    .filter(({ userlevel }) => requestedSet.has(userlevel))
    .map(({ id }) => id)

  const isValid =
    validatedIds.length > 0 &&
    requestedUserlevels.length === validatedIds.length

  if (!isValid) {
    throwValidationError("Userlevels are invalid")
  }

  return validatedIds
}

export const dockIdsAreValid = async (
  line: lineTypes.TLineRequest
): Promise<boolean> => {
  const idsToValidate = [
    line.startDockId,
    line.endDockId,
    ...line.stops.map(({ dockId }) => dockId),
  ]

  const rawDocks = await Dock.findAll()

  const validDockIds = new Set(rawDocks.map((dock) => dock.id))

  return idsToValidate.every((id) => validDockIds.has(id))
}

interface IUserRaw {
  password: string
  id: number
  disabled: boolean
  userlevels: { userlevel: string; id: number }[]
  username: string
}

export const userlevelsToArray = (user: User): userTypes.TUser => {
  const jsonUser: IUserRaw = user.toJSON()

  return {
    ...jsonUser,
    userlevels: jsonUser.userlevels.map((userlevel) => userlevel.userlevel),
  }
}

export const addUserlevels = {
  include: [
    {
      model: Userlevel,
      attributes: ["userlevel"],
      through: {
        attributes: [],
      },
    },
  ],
}

export const lineIncludes = [
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
]

export const createReturnableLine = (
  line: Line
): lineTypes.TLineResponse | null => {
  const { id, startDock, endDock, docks }: lineTypes.TLineRaw = line.toJSON()

  if (!id || !startDock || !endDock || !docks) {
    return null
  }

  const stopDocks = docks
    .map((dock) => ({
      id: dock.id,
      name: dock.name,
      delayFromStart: dock.lineDock.delayFromStart,
    }))
    .sort((a, b) => a.delayFromStart - b.delayFromStart)

  return {
    id,
    startDock: {
      name: startDock.name,
      id: startDock.id,
    },
    endDock: {
      name: endDock.name,
      id: endDock.id,
    },
    stopDocks,
  }
}

interface IFormatLinesEntry {
  lines: lineTypes.TLineRaw[]
  dockId: number
}

interface IFormattedLine {
  lineId: number
  endDock: string
  delay: number
  via: string[]
}

export const formatLines = ({
  lines,
  dockId,
}: IFormatLinesEntry): IFormattedLine[] =>
  lines.flatMap(({ id, docks, startDock, endDock }) => {
    if (!startDock || !endDock) return []

    if (!docks?.length) {
      return startDock.id === dockId
        ? [{ lineId: id, endDock: endDock.name, delay: 0, via: [] }]
        : []
    }

    const sortedDocks = [...docks].sort(
      (a, b) => a.lineDock.delayFromStart - b.lineDock.delayFromStart
    )

    const isStartDock = startDock.id === dockId
    const stopDock = sortedDocks.find((d) => d.id === dockId)

    if (!isStartDock && !stopDock) return []

    const delay = isStartDock ? 0 : stopDock!.lineDock.delayFromStart
    const via = isStartDock
      ? sortedDocks.map((dock) => dock.name)
      : sortedDocks
          .slice(sortedDocks.indexOf(stopDock!) + 1)
          .map((dock) => dock.name)

    return [{ lineId: id, endDock: endDock.name, delay, via }]
  })
