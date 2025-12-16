import {
  Departure,
  Dock,
  Line,
  LineDock,
  User,
  UserAndlevel,
} from "../../database/models"
import { Op } from "@sequelize/core"
import bcrypt from "bcrypt"

import { docks } from "./docks"
import { getUserlevels } from "../../backend/util/helperFunctions"
import { TNewUserRequest } from "../../types/userTypes"

interface IDock {
  id: number
  name: string
}

interface ILine {
  id: number
  startDockId: number
  endDockId: number
}

const create20Docks = async () => {
  const returnDocks: IDock[] = (await Dock.bulkCreate(docks)).map((d) =>
    d.toJSON()
  )
  return returnDocks
}

interface IJsonUser {
  id: number
  userlevels?: { userlevel: string }[]
  disabled: boolean
  username: string
}

export const deleteAllButHal = async () => {
  const hal = await User.findOne({
    attributes: { exclude: ["password"] },
    where: { username: "hal" },
  })
  if (hal) {
    const jsonHal: IJsonUser = hal.toJSON()
    await UserAndlevel.destroy({
      where: { userId: { [Op.not]: jsonHal.id } },
    })
    await User.destroy({ where: { id: { [Op.not]: jsonHal.id } } })
  }
}

const initializeUsers = async () => {
  const allUserlevels = await getUserlevels()

  const createUser = async (user: TNewUserRequest) => {
    const pwHash = await bcrypt.hash(user.password, 10)

    const createdUser = await User.create({
      username: user.username,
      password: pwHash,
    })

    const levelsToAdd = allUserlevels.filter((l) =>
      user.userlevel.includes(l.userlevel)
    )
    const userAndLevelsToAdd = levelsToAdd.map((l) => {
      return { userlevelId: l.id, userId: createdUser.id }
    })
    await UserAndlevel.bulkCreate(userAndLevelsToAdd)
  }
  await createUser({
    username: "aami",
    userlevel: ["user", "admin"],
    password: String(process.env.TEST_ADMIN_PW),
  })

  await createUser({
    username: "juuse",
    userlevel: ["user"],
    password: String(process.env.TEST_USER_PW),
  })

  await createUser({
    username: "matti",
    userlevel: ["user", "admin"],
    password: String(process.env.MATTI_PW),
  })

  await createUser({
    username: "outisa",
    userlevel: ["user", "admin"],
    password: String(process.env.OUTISA_PW),
  })
  return 4
}

const create4Lines = async (docks: IDock[]) => {
  const lines = [
    { startDockId: docks[0].id, endDockId: docks[5].id },
    { startDockId: docks[2].id, endDockId: docks[7].id },
    { startDockId: docks[8].id, endDockId: docks[7].id },
    { startDockId: docks[1].id, endDockId: docks[4].id },
  ]
  const createdLines: ILine[] = (await Line.bulkCreate(lines)).map((l) =>
    l.toJSON()
  )

  const stops = [
    { lineId: createdLines[0].id, dockId: docks[9].id, delayFromStart: 11 },
    { lineId: createdLines[1].id, dockId: docks[0].id, delayFromStart: 22 },
    { lineId: createdLines[1].id, dockId: docks[5].id, delayFromStart: 33 },
    { lineId: createdLines[2].id, dockId: docks[0].id, delayFromStart: 24 },
    { lineId: createdLines[2].id, dockId: docks[5].id, delayFromStart: 42 },
    { lineId: createdLines[2].id, dockId: docks[6].id, delayFromStart: 63 },
  ]
  await LineDock.bulkCreate(stops)
  return createdLines.map((l) => l.id)
}

const create10Departures = async (lineIds: number[]) => {
  const depaerturesToAdd: { lineId: number; start: Date }[] = []
  for (let i = 1; i < 21; i++) {
    const now = new Date(Date.now())
    const departures = [
      {
        lineId: lineIds[0],
        start: new Date(new Date(Date.now()).setHours(now.getHours() + i)),
      },
      {
        lineId: lineIds[0],
        start: new Date(new Date(Date.now()).setDate(now.getDate() + i)),
      },
      {
        lineId: lineIds[1],
        start: new Date(new Date(Date.now()).setHours(now.getHours() + i)),
      },
      {
        lineId: lineIds[1],
        start: new Date(new Date(Date.now()).setDate(now.getDate() + i)),
      },
      {
        lineId: lineIds[2],
        start: new Date(new Date(Date.now()).setDate(now.getDate() - i)),
      },
      {
        lineId: lineIds[2],
        start: new Date(new Date(Date.now()).setHours(now.getHours() + i)),
      },
      {
        lineId: lineIds[2],
        start: new Date(new Date(Date.now()).setDate(now.getDate() + i)),
      },
      {
        lineId: lineIds[3],
        start: new Date(new Date(Date.now()).setDate(now.getDate() - i)),
      },
      {
        lineId: lineIds[3],
        start: new Date(new Date(Date.now()).setHours(now.getHours() + i)),
      },
      {
        lineId: lineIds[3],
        start: new Date(new Date(Date.now()).setDate(now.getDate() + i)),
      },
    ]
    depaerturesToAdd.push(...departures)
  }

  return (await Departure.bulkCreate(depaerturesToAdd)).map((d) => d.toJSON())
}

const initializeDb = async () => {
  // clear database
  try {
    await Departure.destroy({ where: {} })
    await LineDock.destroy({ where: {} })
    await Line.destroy({ where: {} })
    await Dock.destroy({ where: {} })
    await deleteAllButHal()
    // add initial values
    const initialUsersCount = await initializeUsers()
    const docksDb = await create20Docks()
    const lineIdsDb = await create4Lines(docksDb)
    const departuresDb = await create10Departures(lineIdsDb)
    return { docksDb, lineIdsDb, departuresDb, initialUsersCount }
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message)
    }
    return null
  }
}

export default initializeDb
