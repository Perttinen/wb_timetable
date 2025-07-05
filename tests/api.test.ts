import request from "supertest";
import app from "../backend/app";
import {
  IJsonSafeUser,
  IJsonUserTokenFlattenedLevels,
  ILineReturnable,
} from "../types";
import initializeTestDb from "./testHelpers/initializeTestDb";
import {
  iDockTestObject,
  iLineReturnableTestObject,
} from "./testHelpers/data/anyObjects";
import { loginResponseBodyProperties } from "./testHelpers/data/testValues";

interface IDock {
  id: number;
  name: string;
}
let testDock: IDock;

const halPw = process.env.HAL_PW;
const testPw = process.env.TEST_PW;

let testAdmin: IJsonUserTokenFlattenedLevels;
let testUser: IJsonUserTokenFlattenedLevels;
let hal: IJsonUserTokenFlattenedLevels;
let inits: { docksDb: IDock[]; lineIdsDb: number[] } | null;
let docks: IDock[];
let lineIds: number[];
let createdLine: ILineReturnable;

describe("API", () => {
  beforeAll(async () => {
    inits = await initializeTestDb();
    if (inits?.docksDb && inits.lineIdsDb) {
      docks = inits.docksDb;
      lineIds = inits.lineIdsDb;
    }
  }, 10000);
  describe("LOGIN & AUTH & USER", () => {
    test("Hal logs in, POST /api/auth/login", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "hal", password: halPw });
      const body = response.body as IJsonUserTokenFlattenedLevels;
      hal = body;
      expect(response.status).toBe(200);
      loginResponseBodyProperties.forEach((property) =>
        expect(body).toHaveProperty(property)
      );
      expect(body.userlevels).toHaveLength(3);
      expect(body.userlevels).toEqual(
        expect.arrayContaining(["hal", "admin", "user"])
      );
    });
    test("Non existing user logs in, POST /api/auth/login", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "conan", password: "crom" });
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: { name: "NotFoundError", message: "user not found" },
      });
    });
    test("Hal logs in with wrong password, POST /api/auth/login", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "hal", password: "daisybell" });
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: { message: "invalid password", name: "AuthError" },
      });
    });
    test("hal creates admin, POST /api/user", async () => {
      const expectedProperties = ["id", "username", "disabled", "userlevels"];
      const response = await request(app)
        .post("/api/user")
        .send({
          username: "testAdmin",
          password: testPw,
          userlevel: ["admin", "user"],
        })
        .set("Authorization", `Bearer ${hal.token}`);

      const body = response.body as IJsonUserTokenFlattenedLevels;
      testAdmin = body;
      expect(response.status).toBe(201);
      expectedProperties.forEach((property) =>
        expect(body).toHaveProperty(property)
      );
      expect(body.userlevels).toHaveLength(2);
      expect(body.userlevels).toEqual(
        expect.arrayContaining(["admin", "user"])
      );
      expect(body.disabled).toBe(false);
    });
    test("hal creates admin with duplicate username, POST /api/user", async () => {
      const response = await request(app)
        .post("/api/user")
        .send({
          username: "testAdmin",
          password: "abcd",
          userlevel: ["user", "admin"],
        })
        .set("Authorization", `Bearer ${hal.token}`);
      expect(response.body).toEqual({
        error: {
          message: "Validation error",
          name: "SequelizeUniqueConstraintError",
        },
      });
      expect(response.status).toBe(422);
    });
    test("admin logs in, POST /api/auth/login", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "testAdmin", password: testPw });
      const body = response.body as IJsonUserTokenFlattenedLevels;
      testAdmin = body;
      expect(response.status).toBe(200);
      loginResponseBodyProperties.forEach((property) =>
        expect(testAdmin).toHaveProperty(property)
      );
      expect(testAdmin.userlevels).toHaveLength(2);
      expect(testAdmin.userlevels).toEqual(
        expect.arrayContaining(["admin", "user"])
      );
    });
    test("admin creates user, POST /api/user", async () => {
      const expectedProperties = ["id", "username", "disabled", "userlevels"];
      const response = await request(app)
        .post("/api/user")
        .send({
          username: "testUser",
          password: testPw,
          userlevel: ["user"],
        })
        .set("Authorization", `Bearer ${testAdmin.token}`);
      const body = response.body as IJsonUserTokenFlattenedLevels;
      testUser = body;
      expect(response.status).toBe(201);
      expectedProperties.forEach((property) =>
        expect(testUser).toHaveProperty(property)
      );
      expect(testUser.userlevels).toHaveLength(1);
      expect(testUser.userlevels).toEqual(expect.arrayContaining(["user"]));
      expect(testUser.disabled).toBe(false);
    });
    test("user logs in, POST /api/auth/login", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "testUser", password: testPw });
      const body = response.body as IJsonUserTokenFlattenedLevels;
      testUser = body;
      expect(response.status).toBe(200);
      loginResponseBodyProperties.forEach((property) =>
        expect(testUser).toHaveProperty(property)
      );
      expect(testUser.userlevels).toHaveLength(1);
      expect(testUser.userlevels).toEqual(expect.arrayContaining(["user"]));
    });
    test("user gets admin, GET /api/user:id", async () => {
      const response = await request(app)
        .get(`/api/user/${testAdmin.id}`)
        .set("Authorization", `Bearer ${testUser.token}`);
      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: { message: "unauthorized", name: "AuthError" },
      });
    });
    test("user gets self, GET /api/user:id", async () => {
      const response = await request(app)
        .get(`/api/user/${testUser.id}`)
        .set("Authorization", `Bearer ${testUser.token}`);
      expect(response.status).toBe(200);
    });
    test("admin gets user, GET /api/user:id", async () => {
      const expectedProperties = ["id", "username", "disabled", "userlevels"];
      const response = await request(app)
        .get(`/api/user/${testUser.id}`)
        .set("Authorization", `Bearer ${testAdmin.token}`);
      const body = response.body as IJsonUserTokenFlattenedLevels;
      expect(response.status).toBe(200);
      expectedProperties.forEach((property) =>
        expect(body).toHaveProperty(property)
      );
      expect(body.userlevels).toHaveLength(1);
      expect(body.userlevels).toEqual(expect.arrayContaining(["user"]));
    });
    test("admin gets all users, GET /api/user", async () => {
      const response = await request(app)
        .get("/api/user")
        .set("Authorization", `Bearer ${testAdmin.token}`);
      const body = response.body as IJsonUserTokenFlattenedLevels[];
      expect(response.status).toBe(200);
      expect(body.length).toBe(2);
    });
    test("admin updates user, PATCH /api/auth/login", async () => {
      const response = await request(app)
        .patch(`/api/user/${testUser.id}`)
        .set("Authorization", `Bearer ${testAdmin.token}`)
        .send({ id: testUser.id, username: "dille" });
      const body = response.body as IJsonSafeUser;
      testUser.username = body.username;
      expect(response.status).toBe(200);
      expect(testUser.username).toBe("dille");
    });
    test("updated user logs in, POST /api/auth/login", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "dille", password: testPw });
      testUser = response.body as IJsonUserTokenFlattenedLevels;
      expect(response.status).toBe(200);
      expect(testUser).toBeDefined();
      loginResponseBodyProperties.forEach((property) =>
        expect(testUser).toHaveProperty(property)
      );
    });
    test("user updates self, PATCH /api/user", async () => {
      const response = await request(app)
        .patch(`/api/user/${testUser.id}`)
        .set("Authorization", `Bearer ${testUser.token}`)
        .send({ id: testUser.id, username: "kalle" });
      const body = response.body as IJsonSafeUser;
      testUser.username = body.username;
      expect(response.status).toBe(200);
      expect(testUser.username).toBe("kalle");
    });
    test("user updates admin, PATCH /api/user", async () => {
      const response = await request(app)
        .patch(`/api/user/${testAdmin.id}`)
        .set("Authorization", `Bearer ${testUser.token}`)
        .send({ id: testAdmin.id, username: "kalle" });

      expect(response.status).toBe(401);
      expect(response.body).toEqual({
        error: { name: "AuthError", message: "unauthorized" },
      });
    });
  });
  describe("DOCK", () => {
    test("hal creates dock, POST /api/dock", async () => {
      const response = await request(app)
        .post("/api/dock")
        .send({
          name: "haldock",
        })
        .set("Authorization", `Bearer ${hal.token}`);
      testDock = response.body as IDock;
      expect(response.status).toBe(201);
      expect(testDock).toEqual(iDockTestObject);
      expect(testDock.name).toBe("haldock");
    });
    test("hal creates dock with no name, POST /api/dock", async () => {
      const response = await request(app)
        .post("/api/dock")
        .send({
          name: "",
        })
        .set("Authorization", `Bearer ${hal.token}`);
      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: {
          name: "ValidationError",
          message: "required { name } input value missing",
        },
      });
    });
    test("hal gets all docks, GET /api/dock", async () => {
      const response = await request(app)
        .get("/api/dock")
        .set("Authorization", `Bearer ${hal.token}`);
      const body = response.body as IDock[];
      expect(response.status).toBe(200);
      expect(body.length).toBe(21);
      expect(body[8]).toEqual(iDockTestObject);
    });
    test("hal updates dock, PATCH /api/dock", async () => {
      const response = await request(app)
        .patch("/api/dock")
        .set("Authorization", `Bearer ${hal.token}`)
        .send({ id: testDock.id, name: "dalhock" });
      testDock = response.body as IDock;
      expect(response.status).toBe(200);
      expect(testDock).toEqual(iDockTestObject);
      expect(testDock.name).toBe("dalhock");
    });
    test("hal updates dock to duplicate name, PATCH /api/dock", async () => {
      const response = await request(app)
        .patch("/api/dock")
        .set("Authorization", `Bearer ${hal.token}`)
        .send({ id: testDock.id, name: docks[2].name });

      expect(response.status).toBe(422);
      expect(response.body).toEqual({
        error: {
          name: "SequelizeUniqueConstraintError",
          message: "Validation error",
        },
      });
    });
    test("hal gets dock, GET /api/dock:id", async () => {
      const response = await request(app)
        .get(`/api/dock/${testDock.id}`)
        .set("Authorization", `Bearer ${hal.token}`);
      const body = response.body as IDock;
      expect(response.status).toBe(200);
      expect(body).toEqual(iDockTestObject);
      expect(body.name).toBe("dalhock");
    });
    test("hal gets non existing dock, GET /api/dock:id", async () => {
      const response = await request(app)
        .get(`/api/dock/666`)
        .set("Authorization", `Bearer ${hal.token}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: { name: "NotFoundError", message: "dock 666 not found" },
      });
    });
    test("hal deletes dock, DELETE /api/dock:id", async () => {
      const response = await request(app)
        .delete(`/api/dock/${testDock.id}`)
        .set("Authorization", `Bearer ${hal.token}`);
      const docks = await request(app)
        .get(`/api/dock/`)
        .set("Authorization", `Bearer ${hal.token}`);
      const docksBody = docks.body as IDock[];
      expect(response.status).toBe(204);
      expect(docksBody.length).toBe(20);
    });
    test("hal deletes non existing dock, DELETE /api/dock:id", async () => {
      const response = await request(app)
        .delete(`/api/dock/666`)
        .set("Authorization", `Bearer ${hal.token}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: { name: "NotFoundError", message: "nothing deleted" },
      });
    });
  });
  describe("LINE", () => {
    test("hal get all lines, GET /api/line", async () => {
      const response = await request(app)
        .get(`/api/line`)
        .set("Authorization", `Bearer ${hal.token}`);
      const body = response.body as ILineReturnable[];
      expect(body.length).toBe(4);
      expect(body[1]).toEqual(iLineReturnableTestObject);
    });
    test("hal creates line, POST /api/line", async () => {
      const response = await request(app)
        .post(`/api/line`)
        .send({
          startDockId: docks[2].id,
          stops: [
            { dockId: docks[4].id, delayFromStart: 45 },
            { dockId: docks[6].id, delayFromStart: 20 },
          ],
          endDockId: docks[8].id,
        })
        .set("Authorization", `Bearer ${hal.token}`);
      createdLine = response.body as ILineReturnable;
      expect(response.status).toBe(201);
      expect(createdLine).toEqual(iLineReturnableTestObject);
    });
    test("user get line, GET /api/line/:id", async () => {
      const response = await request(app)
        .get(`/api/line/${createdLine.id}`)
        .set("Authorization", `Bearer ${testUser.token}`);
      const body = response.body as ILineReturnable;
      expect(response.status).toBe(200);
      expect(body).toEqual(iLineReturnableTestObject);
    });
    test("hal updates line, PATCH /api/line/:id", async () => {
      const response = await request(app)
        .patch(`/api/line/${createdLine.id}`)
        .set("Authorization", `Bearer ${hal.token}`)
        .send({
          startDockId: docks[2].id,
          endDockId: docks[4].id,
          stops: [
            { dockId: docks[7].id, delayFromStart: 60 },
            { dockId: docks[8].id, delayFromStart: 15 },
          ],
        });
      expect(response.status).toBe(200);
      expect(response.body).toEqual(iLineReturnableTestObject);
    });
    test("admin deletes line, DELETE /api/line/:id", async () => {
      const response = await request(app)
        .delete(`/api/line/${createdLine.id}`)
        .set("Authorization", `Bearer ${testAdmin.token}`);
      expect(response.status).toBe(204);
    });
    test("hal deletes non existing line, DELETE /api/line/:id", async () => {
      const response = await request(app)
        .delete(`/api/line/666`)
        .set("Authorization", `Bearer ${hal.token}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        error: { name: "NotFoundError", message: `line 666 not destroyed` },
      });
    });
  });
  describe("DEPARTURE", () => {
    test("user gets all departures, GET /api/departure", async () => {
      const response = await request(app)
        .get("/api/departure")
        .set("Authorization", `Bearer ${testUser.token}`);

      expect(response.status).toBe(200);
    });
    test("get next 20 departures by dock name, GET /api/departure/timetable/:dockName", async () => {
      const response = await request(app).get(
        `/api/departure/timetable/${docks[0].name}`
      );
      expect(response.status).toBe(200);
    });
    test("user get departures by line id, GET /api/departure/line/:lineId", async () => {
      const response = await request(app)
        .get(`/api/departure/line/${lineIds[1]}`)
        .set("Authorization", `Bearer ${testUser.token}`);
      expect(response.status).toBe(200);
    });
  });
});
