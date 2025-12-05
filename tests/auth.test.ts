import { login } from "./helpers/api";

describe("Auth API", () => {
  test("Hal logs in successfully", async () => {
    const response = await login("hal", process.env.HAL_PW!);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("token");
  });

  test("Invalid user login fails", async () => {
    const response = await login("conan", "crom");
    expect(response.status).toBe(404);
  });
});
