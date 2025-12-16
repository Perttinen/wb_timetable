import { TLoginResponse } from "../types/authTypes"
import { login } from "./helpers/api"
import initializeDb from "./helpers/initializeTestDb"

const userProperties = ["id", "username", "disabled", "userlevels"]

describe("Auth API", () => {
  beforeAll(async () => {
    await initializeDb()
  })
  test("Hal can log in", async () => {
    const response = await login("hal", process.env.HAL_PW!)
    expect(response.status).toBe(200)
    const body = response.body as TLoginResponse
    expect(body).toHaveProperty("token")
    userProperties.forEach((property) =>
      expect(body.user).toHaveProperty(property)
    )
    expect(body.user.userlevels).toHaveLength(3)
    expect(body.user.userlevels).toEqual(
      expect.arrayContaining(["hal", "admin", "user"])
    )
  })

  test("Invalid login fails", async () => {
    const response = await login("conan", "crom")
    expect(response.status).toBe(404)
    expect(response.body).toEqual({
      error: { name: "NotFoundError", message: "user not found" },
    })
  })

  test("Wrong password fails, POST /api/auth/login", async () => {
    const response = await login("hal", "wrongPw")
    expect(response.status).toBe(401)
    expect(response.body).toEqual({
      error: { message: "invalid password", name: "AuthError" },
    })
  })
})
