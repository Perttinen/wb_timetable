import request from "supertest"

import app from "../backend/app"
import initializeDb from "./helpers/initializeTestDb"
import { login } from "./helpers/api"
import { TTestUser } from "../types/userTypes"
import { TDock } from "../types/dockTypes"
import { TLoginResponse } from "../types/authTypes"
import db from "../database/db"

describe("Dock API", () => {
  const hal: TTestUser = {} as TTestUser
  let docks: TDock[] = [] as TDock[]
  let testDock: TDock

  beforeAll(async () => {
    const db = await initializeDb()
    if (!db) {
      throw new Error("Database initialization failed")
    }
    const { docksDb } = db
    docks = docksDb
    const halLogin = (await login("hal", process.env.HAL_PW!))
      .body as TLoginResponse
    hal.token = halLogin.token
  })

  afterAll(async () => {
    await db.closeDatabase()
  })

  test("Create dock, POST /dock", async () => {
    const response = await request(app)
      .post("/api/dock")
      .set("Authorization", `Bearer ${hal.token}`)
      .send({ name: "haldock" })
    testDock = response.body as TDock
    expect(response.status).toBe(201)
    expect(testDock.name).toBe("haldock")
  })

  test("Get docks, GET /dock", async () => {
    const response = await request(app)
      .get("/api/dock")
      .set("Authorization", `Bearer ${hal.token}`)
    const body = response.body as TDock[]
    expect(response.status).toBe(200)
    expect(body.length).toBe(11)
  })

  test("Update dock, PATCH /api/dock", async () => {
    const response = await request(app)
      .patch("/api/dock")
      .set("Authorization", `Bearer ${hal.token}`)
      .send({ id: testDock.id, name: "dalhock" })
    testDock = response.body as TDock
    expect(response.status).toBe(200)
    expect(testDock.name).toBe("dalhock")
  })

  test("Get dock, GET /api/dock:id", async () => {
    const response = await request(app)
      .get(`/api/dock/${testDock.id}`)
      .set("Authorization", `Bearer ${hal.token}`)
    const body = response.body as TDock
    expect(response.status).toBe(200)
    expect(body.name).toBe("dalhock")
  })

  test("Delete dock, DELETE /api/dock:id", async () => {
    const response = await request(app)
      .delete(`/api/dock/${testDock.id}`)
      .set("Authorization", `Bearer ${hal.token}`)
    docks = (
      await request(app)
        .get(`/api/dock/`)
        .set("Authorization", `Bearer ${hal.token}`)
    ).body as TDock[]
    expect(response.status).toBe(200)
    expect(docks.length).toBe(10)
  })
})
