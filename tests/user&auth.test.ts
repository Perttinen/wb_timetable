import request from "supertest";
import app from "../backend/app";
import { IJsonSafeUser, IJsonUser } from "../types";

const halPw = process.env.HAL_PW;
const testPw = process.env.TEST_PW;

let hal: IJsonSafeUser;
let testAdmin: IJsonSafeUser;
let testUser: IJsonSafeUser;

describe("USER & AUTH", () => {
  test("Hal logs in, POST /api/auth/login", async () => {
    const halResponse = await request(app)
      .post("/api/auth/login")
      .send({ username: "hal", password: halPw });
    hal = halResponse.body as IJsonSafeUser;
  }, 10000);

  test("hal destroys everyone else, DELETE /api/user", async () => {
    const response = await request(app)
      .delete("/api/user")
      .set("Authorization", `Bearer ${hal.token}`);
    expect(response.status).toBe(204);
  });

  test("hal creates admin, POST /api/user", async () => {
    const response = await request(app)
      .post("/api/user")
      .send({
        username: "testAdmin",
        password: testPw,
        userlevel: ["admin", "user"],
      })
      .set("Authorization", `Bearer ${hal.token}`);

    const returnedAdmin = response.body as IJsonUser;
    expect(returnedAdmin.userlevels).toContain("user");
    expect(returnedAdmin.userlevels).toContain("admin");
    expect(returnedAdmin.userlevels).not.toContain("hal");
  });

  test("admin logs in, POST /api/auth/login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "testAdmin", password: testPw });
    testAdmin = response.body as IJsonSafeUser;
    expect(response.status).toBe(200);
  });

  test("admin creates user, POST /api/user", async () => {
    const response = await request(app)
      .post("/api/user")
      .send({
        username: "testUser",
        password: testPw,
      })
      .set("Authorization", `Bearer ${testAdmin.token}`);
    const returnedUser = response.body as IJsonUser;
    expect(returnedUser.userlevels).toContain("user");
    expect(returnedUser.userlevels).not.toContain("admin");
    expect(returnedUser.userlevels).not.toContain("hal");
  });

  test("user logs in, POST /api/auth/login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "testUser", password: testPw });
    testUser = response.body as IJsonSafeUser;
    expect(response.status).toBe(200);
    expect(testUser).toBeDefined();
  });

  test("admin gets user, GET /api/user:id", async () => {
    const response = await request(app)
      .get(`/api/user/${testUser.id}`)
      .set("Authorization", `Bearer ${testAdmin.token}`);
    expect(response.status).toBe(200);
  });

  test("user gets all users, GET /api/user", async () => {
    const response = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${testUser.token}`);
    const body = response.body as IJsonUser[];
    expect(response.status).toBe(200);
    expect(body.length).toBe(3);
  });

  test("admin updates user, PATCH /api/auth/login", async () => {
    const response = await request(app)
      .patch("/api/user")
      .set("Authorization", `Bearer ${testAdmin.token}`)
      .send({ id: testUser.id, username: "dille" });
    testUser = response.body as IJsonSafeUser;
    expect(response.status).toBe(200);
    expect(testUser.username).toBe("dille");
  });

  test("updated user logs in, POST /api/auth/login", async () => {
    const response = await request(app)
      .post("/api/auth/login")
      .send({ username: "dille", password: testPw });
    testUser = response.body as IJsonSafeUser;
    expect(response.status).toBe(200);
    expect(testUser).toBeDefined();
  });

  test("user deletes admin, DELETE /api/user:id", async () => {
    const response = await request(app)
      .delete(`/api/user/${testAdmin.id}`)
      .set("Authorization", `Bearer ${testUser.token}`);
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "unauthorized" });
  });

  test("admin deletes user, DELETE /api/user:id", async () => {
    const response = await request(app)
      .delete(`/api/user/${testUser.id}`)
      .set("Authorization", `Bearer ${testAdmin.token}`);
    expect(response.status).toBe(204);
  });

  test("hal deletes admin, DELETE /api/user:id", async () => {
    const response = await request(app)
      .delete(`/api/user/${testAdmin.id}`)
      .set("Authorization", `Bearer ${hal.token}`);
    expect(response.status).toBe(204);
  });

  test("hal gets all, GET /api/user", async () => {
    const response = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${hal.token}`);
    const body = response.body as IJsonUser[];
    expect(response.status).toBe(200);
    expect(body.length).toBe(1);
  });
});
