import request from "supertest";
import app from "../backend/app";
import { IJsonSafeUser, IJsonUser } from "../types";

const halPw = process.env.HAL_PW;

let hal: IJsonSafeUser;
let testAdmin: IJsonUser;
let testUser: IJsonUser;

beforeAll(() => {
  setTimeout(() => {
    console.log("Waiting for 2 seconds.");
  }, 2000);
});

describe("USER", () => {
  it("login, POST /auth/login", async () => {
    const halResponse = await request(app)
      .post("/auth/login")
      .send({ username: "hal", password: halPw });
    hal = halResponse.body as IJsonSafeUser;
  });
  it("hal destroys everyone else, DELETE /userapi", async () => {
    const response = await request(app)
      .delete("/userapi")
      .set("Authorization", `Bearer ${hal.token}`);
    expect(response.status).toBe(204);
  });
  it("getAllUsers, GET /userapi", async () => {
    const response = await request(app)
      .get("/userapi")
      .set("Authorization", `Bearer ${hal.token}`);
    const body = response.body as IJsonUser[];
    expect(response.status).toBe(200);
    expect(body.length).toBe(1);
  });
  it("create admin, POST /userapi", async () => {
    const adminResponse = await request(app)
      .post("/userapi")
      .send({
        username: "testAdmin",
        password: process.env.TEST_PW,
        userlevel: ["admin", "user"],
      })
      .set("Authorization", `Bearer ${hal.token}`);

    testAdmin = adminResponse.body as IJsonUser;
    expect(testAdmin.userlevels).toContain("user");
    expect(testAdmin.userlevels).toContain("admin");
    expect(testAdmin.userlevels).not.toContain("hal");
  });
  it('"create user, POST /userapi"', async () => {
    const userResponse = await request(app)
      .post("/userapi")
      .send({
        username: "testUser",
        password: process.env.TEST_PW,
        userlevel: ["user"],
      })
      .set("Authorization", `Bearer ${hal.token}`);
    testUser = userResponse.body as IJsonUser;

    expect(testUser.userlevels).toContain("user");
    expect(testUser.userlevels).not.toContain("admin");
    expect(testUser.userlevels).not.toContain("hal");
  });

  // it("getUser, GET /userapi:id", async () => {
  //   const response = await request(app)
  //     .get(`/userapi/${testAdmin.id}`)
  //     .set("Authorization", `Bearer ${hal.token}`);
  //   const body = response.body as IJsonUser;
  //   expect(response.status).toBe(200);
  //   expect(body).toEqual(testAdmin);
  // });
});
