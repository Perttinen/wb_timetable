import request from "supertest";
import app from "../backend/app";
import { IJsonSafeUser, IJsonUser } from "../types";

const halPw = process.env.HAL_PW;

let hal: IJsonSafeUser;
let testAdmin: IJsonUser;
let testUser: IJsonUser;

beforeAll(async () => {
  const halResponse = await request(app)
    .post("/auth/login")
    .send({ username: "hal", password: halPw });
  hal = halResponse.body as IJsonSafeUser;
  console.log("1. hal: ", hal);
  await request(app)
    .delete("/userapi")
    .set("Authorization", `Bearer ${hal.token}`);

  const adminResponse = await request(app)
    .post("/userapi")
    .send({
      username: "viki",
      password: "salasana",
      userlevel: ["admin", "user"],
    })
    .set("Authorization", `Bearer ${hal.token}`);
  testAdmin = adminResponse.body as IJsonUser;

  const userResponse = await request(app)
    .post("/userapi")
    .send({
      username: "hemma",
      password: "salasana",
    })
    .set("Authorization", `Bearer ${hal.token}`);
  expect(userResponse.status).toBe(201);
  testUser = userResponse.body as IJsonUser;
  console.log(testUser);
});

describe("USER", () => {
  it("getAllUsers, GET /userapi", async () => {
    const response = await request(app)
      .get("/userapi")
      .set("Authorization", `Bearer ${hal.token}`);
    const body = response.body as IJsonUser[];
    expect(response.status).toBe(200);
    expect(body.length).toBe(3);
  });

  it("getUser, GET /userapi:id", async () => {
    const response = await request(app)
      .get(`/userapi/${testAdmin.id}`)
      .set("Authorization", `Bearer ${hal.token}`);
    const body = response.body as IJsonUser;
    expect(response.status).toBe(200);
    expect(body).toEqual(testAdmin);
  });
});
