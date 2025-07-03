import request from "supertest";
import app from "../backend/app";
import { IJsonSafeUser, IJsonUser } from "../types";
import initializeTestDb from "./testHelpers/initializeTestDb";

interface IDock {
  id: number;
  name: string;
}

interface Dock {
  id: number;
  name: string;
}
let testDock: Dock;

const halPw = process.env.HAL_PW;
const testPw = process.env.TEST_PW;

let testAdmin: IJsonSafeUser;
let testUser: IJsonSafeUser;
let hal: IJsonSafeUser;
let docksDb: IDock[] | null;
let docks: IDock[];

describe("API", () => {
  beforeAll(async () => {
    docksDb = await initializeTestDb();
    if (docksDb) {
      docks = docksDb;
    }
  }, 10000);
  describe("LOGIN & USER", () => {
    test("Hal logs in, POST /api/auth/login", async () => {
      const expectedProperties = [
        "token",
        "id",
        "username",
        "disabled",
        "userlevels",
      ];
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "hal", password: halPw });
      const body = res.body as IJsonSafeUser;
      hal = body;
      expect(res.status).toBe(200);
      expectedProperties.forEach((property) =>
        expect(body).toHaveProperty(property)
      );
      expect(body.userlevels).toHaveLength(3);
      expect(body.userlevels).toEqual(
        expect.arrayContaining(["hal", "admin", "user"])
      );
    });
    test("Non existing user logs in, POST /api/auth/login", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "conan", password: "crom" });
      expect(res.status).toBe(404);
      expect(res.body).toEqual({
        error: { name: "NotFoundError", message: "user not found" },
      });
    });
    test("Hal logs in with wrong password, POST /api/auth/login", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "hal", password: "daisybell" });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({
        error: { message: "invalid password", name: "AuthError" },
      });
    });
    test("hal creates admin, POST /api/user", async () => {
      const expectedProperties = ["id", "username", "disabled", "userlevels"];
      const res = await request(app)
        .post("/api/user")
        .send({
          username: "testAdmin",
          password: testPw,
          userlevel: ["admin", "user"],
        })
        .set("Authorization", `Bearer ${hal.token}`);

      const body = res.body as IJsonSafeUser;
      testAdmin = body;
      expect(res.status).toBe(201);
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
      const res = await request(app)
        .post("/api/user")
        .send({
          username: "testAdmin",
          password: "abcd",
          userlevel: ["user", "admin"],
        })
        .set("Authorization", `Bearer ${hal.token}`);
      expect(res.body).toEqual({
        error: {
          message: "Validation error",
          name: "SequelizeUniqueConstraintError",
        },
      });
      expect(res.status).toBe(422);
    });
    test("admin logs in, POST /api/auth/login", async () => {
      const expectedProperties = [
        "token",
        "id",
        "username",
        "disabled",
        "userlevels",
      ];
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "testAdmin", password: testPw });
      const body = res.body as IJsonSafeUser;
      testAdmin = body;
      expect(res.status).toBe(200);
      expectedProperties.forEach((property) =>
        expect(body).toHaveProperty(property)
      );
      expect(body.userlevels).toHaveLength(2);
      expect(body.userlevels).toEqual(
        expect.arrayContaining(["admin", "user"])
      );
    });
    test("admin creates user, POST /api/user", async () => {
      const expectedProperties = ["id", "username", "disabled", "userlevels"];
      const res = await request(app)
        .post("/api/user")
        .send({
          username: "testUser",
          password: testPw,
          userlevel: ["user"],
        })
        .set("Authorization", `Bearer ${testAdmin.token}`);
      const body = res.body as IJsonSafeUser;
      testUser = body;
      expect(res.status).toBe(201);
      expectedProperties.forEach((property) =>
        expect(body).toHaveProperty(property)
      );
      expect(body.userlevels).toHaveLength(1);
      expect(body.userlevels).toEqual(expect.arrayContaining(["user"]));
      expect(body.disabled).toBe(false);
    });
    test("user logs in, POST /api/auth/login", async () => {
      const expectedProperties = [
        "token",
        "id",
        "username",
        "disabled",
        "userlevels",
      ];
      const res = await request(app)
        .post("/api/auth/login")
        .send({ username: "testUser", password: testPw });
      const body = res.body as IJsonSafeUser;
      testUser = body;
      expect(res.status).toBe(200);
      expectedProperties.forEach((property) =>
        expect(body).toHaveProperty(property)
      );
      expect(body.userlevels).toHaveLength(1);
      expect(body.userlevels).toEqual(expect.arrayContaining(["user"]));
    });

    test("user gets admin, GET /api/user:id", async () => {
      const res = await request(app)
        .get(`/api/user/${testAdmin.id}`)
        .set("Authorization", `Bearer ${testUser.token}`);
      const body = res.body as IJsonSafeUser;
      expect(res.status).toBe(401);
      expect(body).toEqual({
        error: { message: "unauthorized", name: "AuthError" },
      });
    });

    test("user gets self, GET /api/user:id", async () => {
      const res = await request(app)
        .get(`/api/user/${testUser.id}`)
        .set("Authorization", `Bearer ${testUser.token}`);
      expect(res.status).toBe(200);
    });

    test("admin gets user, GET /api/user:id", async () => {
      const expectedProperties = ["id", "username", "disabled", "userlevels"];
      const res = await request(app)
        .get(`/api/user/${testUser.id}`)
        .set("Authorization", `Bearer ${testAdmin.token}`);
      const body = res.body as IJsonSafeUser;
      expect(res.status).toBe(200);
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
      const body = response.body as IJsonUser[];
      expect(response.status).toBe(200);
      expect(body.length).toBe(2);
    });
    test("admin updates user, PATCH /api/auth/login", async () => {
      const response = await request(app)
        .patch(`/api/user/${testUser.id}`)
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
    test("user updates self, PATCH /api/auth/login", async () => {
      const response = await request(app)
        .patch(`/api/user/${testUser.id}`)
        .set("Authorization", `Bearer ${testUser.token}`)
        .send({ id: testUser.id, username: "kalle" });
      testUser = response.body as IJsonSafeUser;
      expect(response.status).toBe(200);
      expect(testUser.username).toBe("kalle");
    });
  });
  describe("DEPARTURES", () => {
    test("Hal logs in, POST /api/auth/login", async () => {
      const halResponse = await request(app)
        .post("/api/auth/login")
        .send({ username: "hal", password: halPw });
      hal = halResponse.body as IJsonSafeUser;
    });
    test("hal gets all departures", async () => {
      const response = await request(app)
        .get("/api/departure")
        .set("Authorization", `Bearer ${hal.token}`);
      expect(response.status).toBe(200);
    });
    test("get next 20 departures by dock id", async () => {
      const response = await request(app).get(`/api/departure/${docks[0].id}`);
      expect(response.status).toBe(200);
    });

    // test("hal creates line", async () => {
    //   if (docks !== null) {
    //     const response = await request(app)
    //       .post("/api/line")
    //       .send({
    //         startDockId: docks[0].id,
    //         stops: [{ dockId: docks[1].id, delayFromStart: 15 }],
    //         endDockId: docks[2].id,
    //       })
    //       .set("Authorization", `Bearer ${hal.token}`);
    //     expect(response.status).toBe(201);
    //   }
    // });

    // test("hal creates another line", async () => {
    //   if (docks !== null) {
    //     const response = await request(app)
    //       .post("/api/line")
    //       .send({
    //         startDockId: docks[2].id,
    //         stops: [{ dockId: docks[0].id, delayFromStart: 20 }],
    //         endDockId: docks[3].id,
    //       })
    //       .set("Authorization", `Bearer ${hal.token}`);
    //     expect(response.status).toBe(201);
    //   }
    // });

    //   test("hal destroys all departures, DELETE /api/departure", async () => {
    //     const response = await request(app)
    //       .delete("/api/departures")
    //       .set("Authorization", `Bearer ${hal.token}`);
    //     expect(response.status).toBe(204);
    //   });

    //   test("hal creates dock, POST /api/dock", async () => {
    //     const response = await request(app)
    //       .post("/api/dock")
    //       .send({
    //         name: "haldock",
    //       })
    //       .set("Authorization", `Bearer ${hal.token}`);
    //     testDock = response.body as Dock;
    //     expect(response.status).toBe(201);
    //     expect(testDock.name).toBe("haldock");
    //   });

    //   test("hal updates dock, PATCH /api/dock", async () => {
    //     const response = await request(app)
    //       .patch("/api/dock")
    //       .set("Authorization", `Bearer ${hal.token}`)
    //       .send({ id: testDock.id, name: "dalhock" });
    //     testDock = response.body as Dock;
    //     expect(response.status).toBe(200);
    //     expect(testDock.name).toBe("dalhock");
    //   });

    //   test("hal gets all docks, GET /api/dock", async () => {
    //     const response = await request(app)
    //       .get("/api/dock")
    //       .set("Authorization", `Bearer ${hal.token}`);
    //     const body = response.body as Dock[];
    //     expect(response.status).toBe(200);
    //     expect(body.length).toBe(1);
    //   });

    //   test("hal gets dock, GET /api/dock:id", async () => {
    //     const response = await request(app)
    //       .get(`/api/dock/${testDock.id}`)
    //       .set("Authorization", `Bearer ${hal.token}`);
    //     const body = response.body as Dock;
    //     expect(response.status).toBe(200);
    //     expect(body.name).toBe("dalhock");
    //   });

    //   test("hal deletes dock, DELETE /api/dock:id", async () => {
    //     const response = await request(app)
    //       .delete(`/api/dock/${testDock.id}`)
    //       .set("Authorization", `Bearer ${hal.token}`);
    //     expect(response.status).toBe(204);
    //   });

    //   test("delete all docks, lines and dockLines", async () => {
    //     const response = await request(app).delete("/api/dock/");
    //     expect(response.status).toBe(204);
    //   });

    //   test("create many docks", async () => {
    //     const response = await request(app).post("/api/dock/many").send(tenDocks);
    //     testDocks = response.body as Dock[];
    //     expect(response.status).toBe(201);
    //   });

    //   test("create line", async () => {
    //     const response = await request(app)
    //       .post("/api/line")
    //       .send({
    //         startDockId: testDocks[0].id,
    //         endDockId: testDocks[1].id,
    //         stops: [
    //           { dockId: testDocks[2].id, delayFromStart: 36 },
    //           { dockId: testDocks[3].id, delayFromStart: 45 },
    //         ],
    //       });
    //     expect(response.status).toBe(201);
    //   });

    //   test("create another line", async () => {
    //     const response = await request(app)
    //       .post("/api/line")
    //       .send({
    //         startDockId: testDocks[2].id,
    //         endDockId: testDocks[4].id,
    //         stops: [
    //           { dockId: testDocks[5].id, delayFromStart: 24 },
    //           { dockId: testDocks[8].id, delayFromStart: 6 },
    //         ],
    //       });
    //     expect(response.status).toBe(201);
    //   });
  });
  describe("DOCK", () => {
    test("tosi", () => {
      expect(1 + 1).toBe(2);
    });
    test("Hal logs in, POST /api/auth/login", async () => {
      const response = await request(app)
        .post("/api/auth/login")
        .send({ username: "hal", password: halPw });
      hal = response.body as IJsonSafeUser;
      expect(response.status).toBe(200);
    }, 10000);
    test("hal destroys all docks, DELETE /api/dock", async () => {
      const response = await request(app)
        .delete("/api/dock")
        .set("Authorization", `Bearer ${hal.token}`);
      expect(response.status).toBe(204);
    });
    test("hal creates dock, POST /api/dock", async () => {
      const response = await request(app)
        .post("/api/dock")
        .send({
          name: "haldock",
        })
        .set("Authorization", `Bearer ${hal.token}`);
      testDock = response.body as Dock;
      expect(response.status).toBe(201);
      expect(testDock.name).toBe("haldock");
    });
    test("hal updates dock, PATCH /api/dock", async () => {
      const response = await request(app)
        .patch("/api/dock")
        .set("Authorization", `Bearer ${hal.token}`)
        .send({ id: testDock.id, name: "dalhock" });
      testDock = response.body as Dock;
      expect(response.status).toBe(200);
      expect(testDock.name).toBe("dalhock");
    });
    test("hal gets all docks, GET /api/dock", async () => {
      const response = await request(app).get("/api/dock");
      // .set("Authorization", `Bearer ${hal.token}`);
      const body = response.body as Dock[];
      expect(response.status).toBe(200);
      expect(body.length).toBe(1);
    });
    test("hal gets dock, GET /api/dock:id", async () => {
      const response = await request(app)
        .get(`/api/dock/${testDock.id}`)
        .set("Authorization", `Bearer ${hal.token}`);
      const body = response.body as Dock;
      expect(response.status).toBe(200);
      expect(body.name).toBe("dalhock");
    });
    test("hal deletes dock, DELETE /api/dock:id", async () => {
      const response = await request(app)
        .delete(`/api/dock/${testDock.id}`)
        .set("Authorization", `Bearer ${hal.token}`);
      expect(response.status).toBe(204);
    });
    test("delete all docks, lines and dockLines", async () => {
      const response = await request(app).delete("/api/dock/");
      expect(response.status).toBe(204);
    });
  });
});
