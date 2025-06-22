import request from "supertest";
import app from "../backend/app";
import { IJsonSafeUser } from "../types";

const halPw = process.env.HAL_PW;

let halToken = "";

describe("AUTH", () => {
  it("POST /login", async () => {
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "hal", password: halPw });
    const body = response.body as IJsonSafeUser;
    halToken = body.token;

    expect(response.status).toBe(200);
  });
});

describe("USER", () => {
  it("GET /userapi", async () => {
    const response = await request(app)
      .get("/userapi")
      .set("Authorization", `Bearer ${halToken}`);
    expect(response.status).toBe(200);
  });
});
