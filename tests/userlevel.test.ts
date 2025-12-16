import request from "supertest"

import app from "../backend/app"
import initializeDb from "./helpers/initializeTestDb"
import { login } from "./helpers/api"
import { TTestUser } from "../types/userTypes"
import { TLoginResponse } from "../types/authTypes"
import db from "../database/db"

describe("Userlevel API", () => {
  const hal: TTestUser = {} as TTestUser
  beforeAll(async () => {
    const db = await initializeDb()
    if (!db) {
      throw new Error("Database initialization failed")
    }
    const halLogin = (await login("hal", process.env.HAL_PW!))
      .body as TLoginResponse
    hal.token = halLogin.token
  })

  afterAll(async () => {
    await db.closeDatabase()
  })
  test("Get userlevels, GET /userlevel", async () => {
    const response = await request(app)
      .get("/api/userlevel")
      .set("Authorization", `Bearer ${hal.token}`)
    expect(response.status).toBe(200)
  })
})
