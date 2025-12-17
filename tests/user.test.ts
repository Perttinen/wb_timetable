import request from "supertest"

import app from "../backend/app"
import { TUserSafe } from "../types/userTypes"
import { login, createUser } from "./helpers/api"
import initializeDb from "./helpers/initializeTestDb"
import { TLoginResponse } from "../types/authTypes"

const userProperties = ["id", "username", "disabled", "userlevels"]

type TTestUser = {
  user: TUserSafe
  token?: string
}

describe("User API", () => {
  const hal: TTestUser = {} as TTestUser
  const testAdmin: TTestUser = {} as TTestUser
  const testUser: TTestUser = {} as TTestUser

  beforeAll(async () => {
    const db = await initializeDb()
    if (!db) {
      throw new Error("Database initialization failed")
    }
    const halLogin = (await login("hal", process.env.HAL_PW!))
      .body as TLoginResponse
    hal.token = halLogin.token
  })

  test("hal can create admin, POST /user", async () => {
    const response = await createUser(String(hal.token), {
      username: "testAdmin",
      password: process.env.TEST_PW!,
      userlevel: ["admin", "user"],
    })
    expect(response.status).toBe(201)
    testAdmin.user = response.body as TUserSafe
    userProperties.forEach((property) =>
      expect(testAdmin.user).toHaveProperty(property)
    )
    expect(testAdmin.user.disabled).toBe(false)
    expect(testAdmin.user.userlevels).toHaveLength(2)
    expect(testAdmin.user.userlevels).toEqual(
      expect.arrayContaining(["admin", "user"])
    )
    const body = (await login("testAdmin", process.env.TEST_PW!))
      .body as TLoginResponse
    testAdmin.token = body.token
  })

  test("admin can create user", async () => {
    const response = await createUser(String(testAdmin.token), {
      username: "testUser",
      password: process.env.TEST_PW!,
      userlevel: ["user"],
    })
    expect(response.status).toBe(201)
    testUser.user = response.body as TUserSafe
    const userBody = (await login("testUser", process.env.TEST_PW!))
      .body as TLoginResponse
    testUser.token = userBody.token
    expect(testUser.user.userlevels).toEqual(["user"])
  })

  test("admin can create admin", async () => {
    const response = await createUser(String(testAdmin.token), {
      username: "anotherAdmin",
      password: process.env.TEST_PW!,
      userlevel: ["user", "admin"],
    })
    expect(response.status).toBe(201)
    userProperties.forEach((property) =>
      expect(response.body).toHaveProperty(property)
    )
  })

  test("Can't create duplicate username", async () => {
    const response = await createUser(String(testAdmin.token), {
      username: "testUser",
      password: process.env.TEST_PW!,
      userlevel: ["user"],
    })
    expect(response.body).toEqual({
      error: {
        message: "Validation error",
        name: "SequelizeUniqueConstraintError",
      },
    })
    expect(response.status).toBe(422)
  })

  test("Get all users, GET /user", async () => {
    const response = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${hal.token}`)
    expect(response.status).toBe(200)
    const body = response.body as TUserSafe[]
    expect(body.length).toBe(3)
  })

  test("Get user by id, GET /usr:id", async () => {
    const response = await request(app)
      .get(`/api/user/${testUser.user.id}`)
      .set("Authorization", `Bearer ${hal.token}`)
    const body = response.body as TUserSafe
    const { id, ...rest } = body
    expect(response.status).toBe(200)
    expect(rest).toEqual({
      disabled: false,
      userlevels: ["user"],
      username: "testUser",
    })
    expect(id).toBe(testUser.user.id)
  })

  test("Update user, PATCH /user/:id", async () => {
    const response = await request(app)
      .patch(`/api/user/${testUser.user.id}`)
      .set("Authorization", `Bearer ${testAdmin.token}`)
      .send({ id: testUser.user.id, username: "dille" })
    const body = response.body as TUserSafe
    testUser.user.username = body.username
    expect(response.status).toBe(200)
    expect(testUser.user.username).toBe("dille")
  })

  test("Delete user, DELETE /user/:id", async () => {
    const response = await request(app)
      .delete(`/api/user/${testUser.user.id}`)
      .set("Authorization", `Bearer ${testAdmin.token}`)
    const usersRes = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${hal.token}`)
    expect(response.status).toBe(204)
    const usersBody = usersRes.body as TUserSafe[]
    expect(usersBody.length).toBe(2)
  })
})
