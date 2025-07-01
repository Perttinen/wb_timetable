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

describe("DEPARTURES", () => {
  beforeAll(async () => {
    docksDb = await initializeTestDb();
    if (docksDb) {
      docks = docksDb;
    }
  });
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
  beforeAll(async () => {
    await initializeTestDb();
  });
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
describe("USER & AUTH", () => {
  test("Hal logs in, POST /api/auth/login", async () => {
    const halResponse = await request(app)
      .post("/api/auth/login")
      .send({ username: "hal", password: halPw });
    hal = halResponse.body as IJsonSafeUser;
  });

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
