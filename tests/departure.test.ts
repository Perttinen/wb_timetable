import request from "supertest"
import dayjs from "dayjs"

import app from "../backend/app"
import initializeDb from "./helpers/initializeTestDb"
import { login } from "./helpers/api"
import { TTestUser } from "../types/userTypes"
import { TDock } from "../types/dockTypes"
import { TLoginResponse } from "../types/authTypes"
import { TDeparture } from "../types/departureTypes"

describe("Departure API", () => {
  const hal: TTestUser = {} as TTestUser

  let lineIds: number[] = []
  let docks: TDock[] = [] as TDock[]

  beforeAll(async () => {
    const db = await initializeDb()
    if (!db) {
      throw new Error("Database initialization failed")
    }
    const { lineIdsDb, docksDb } = db

    lineIds = lineIdsDb
    docks = docksDb
    const halLogin = (await login("hal", process.env.HAL_PW!))
      .body as TLoginResponse
    hal.token = halLogin.token
  })

  test("Create departure, POST /departure/addone", async () => {
    const response = await request(app)
      .post("/api/departure/addone")
      .set("Authorization", `Bearer ${hal.token}`)
      .send({ lineId: lineIds[0], start: Date.now() })
    expect(response.status).toBe(201)
    const body = response.body as TDeparture
    expect(body.lineId).toBe(lineIds[0])
  })

  test("Create departures, POST /departure/addmany", async () => {
    const departuresPayload = []
    for (let i = 0; i < 10; i++) {
      const now = new Date(Date.now())
      const departure = {
        lineId: lineIds[0],
        start: new Date(new Date(Date.now()).setHours(now.getHours() + i)),
      }
      departuresPayload.push(departure)
    }
    const response = await request(app)
      .post("/api/departure/addmany")
      .set("Authorization", `Bearer ${hal.token}`)
      .send(departuresPayload)
    expect(response.status).toBe(201)
    const body = response.body as TDeparture[]
    expect(body.length).toBe(10)
  })

  test("Get next 20 by dock id, GET /departure/timetable/:dockId", async () => {
    const response = await request(app)
      .get(`/api/departure/timetable/${docks[8].id}`)
      .set("Authorization", `Bearer ${hal.token}`)
    expect(response.status).toBe(200)
  })

  test("Delete many departures, DELETE /departure/deletemany", async () => {
    const now = new Date()
    const payload = {
      lineId: lineIds[0],
      fromDate: dayjs(now).format("YYYY-MM-DD"),
      toDate: dayjs(
        new Date(new Date(Date.now()).setDate(now.getDate() + 10))
      ).format("YYYY-MM-DD"),
      fromTime: "01:00",
      toTime: "23:00",
      weekdays: ["true", "false", "true", "false", "true", "false", "false"],
    }
    const response = await request(app)
      .delete("/api/departure/deletemany")
      .set("Authorization", `Bearer ${hal.token}`)
      .send(payload)
    expect(response.status).toBe(200)
    expect(typeof response.body).toBe("number")
  })
})
