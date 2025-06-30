import request from "supertest";
import app from "../backend/app";
// import { IJsonSafeUser } from "../types";
import initializeTestDb from "./testHelpers/initializeTestDb";
// import { Dock } from "../database/models";

// const halPw = process.env.HAL_PW;

// interface Dock {
//   id: number;
//   name: string;
// }

// let hal: IJsonSafeUser;
// let testDock: Dock;
// let testDocks: Dock[];

describe("DOCK", () => {
  beforeAll(async () => {
    const docks = await initializeTestDb();
    if (docks !== null) {
      await request(app)
        .post("/api/line")
        .send({
          startDockId: docks[0].id,
          stops: [{ dockId: docks[1].id, delayFromStart: 15 }],
          endDockId: docks[2].id,
        });
      await request(app)
        .post("/api/line")
        .send({
          startDockId: docks[2].id,
          stops: [{ dockId: docks[0].id, delayFromStart: 20 }],
          endDockId: docks[3].id,
        });
    }
  }, 10000);
  test("tosi", () => {
    expect(1 + 1).toBe(2);
  });
  // test("Hal logs in, POST /api/auth/login", async () => {
  //   const response = await request(app)
  //     .post("/api/auth/login")
  //     .send({ username: "hal", password: halPw });
  //   hal = response.body as IJsonSafeUser;
  //   console.log(hal);
  //   expect(response.status).toBe(200);
  // }, 10000);
  // test("hal destroys all docks, DELETE /api/dock", async () => {
  //   const response = await request(app)
  //     .delete("/api/dock")
  //     .set("Authorization", `Bearer ${hal.token}`);
  //   expect(response.status).toBe(204);
  // });
  // test("hal creates dock, POST /api/dock", async () => {
  //   const response = await request(app)
  //     .post("/api/dock")
  //     .send({
  //       name: "haldock",
  //     })
  //     .set("Authorization", `Bearer ${hal.token}`);
  //   testDock = response.body as Dock;
  //   expect(response.status).toBe(201);
  //   expect(testDock.name).toBe("haldock");
  // });
  // test("hal updates dock, PATCH /api/dock", async () => {
  //   const response = await request(app)
  //     .patch("/api/dock")
  //     .set("Authorization", `Bearer ${hal.token}`)
  //     .send({ id: testDock.id, name: "dalhock" });
  //   testDock = response.body as Dock;
  //   expect(response.status).toBe(200);
  //   expect(testDock.name).toBe("dalhock");
  // });
  // test("hal gets all docks, GET /api/dock", async () => {
  //   const response = await request(app).get("/api/dock");
  //   // .set("Authorization", `Bearer ${hal.token}`);
  //   const body = response.body as Dock[];
  //   console.log(body);

  //   expect(response.status).toBe(200);
  // expect(body.length).toBe(1);
  // });
  // test("hal gets dock, GET /api/dock:id", async () => {
  //   const response = await request(app)
  //     .get(`/api/dock/${testDock.id}`)
  //     .set("Authorization", `Bearer ${hal.token}`);
  //   const body = response.body as Dock;
  //   expect(response.status).toBe(200);
  //   expect(body.name).toBe("dalhock");
  // });
  // test("hal deletes dock, DELETE /api/dock:id", async () => {
  //   const response = await request(app)
  //     .delete(`/api/dock/${testDock.id}`)
  //     .set("Authorization", `Bearer ${hal.token}`);
  //   expect(response.status).toBe(204);
  // });
  // test("delete all docks, lines and dockLines", async () => {
  //   const response = await request(app).delete("/api/dock/");
  //   expect(response.status).toBe(204);
  // });
  // test("create many docks", async () => {
  //   const response = await request(app)
  //     .post("/api/dock/many")
  //     .send(twentyDocks);
  //   testDocks = response.body as Dock[];
  //   expect(response.status).toBe(201);
  // });
  // test("create line", async () => {
  //   const response = await request(app)
  //     .post("/api/line")
  //     .send({
  //       startDockId: testDocks[0].id,
  //       endDockId: testDocks[1].id,
  //       stops: [
  //         { dockId: testDocks[2].id, delayFromStart: 36 },
  //         { dockId: testDocks[3].id, delayFromStart: 45 },
  //       ],
  //     });
  //   expect(response.status).toBe(201);
  // });
  // test("create another line", async () => {
  //   const response = await request(app)
  //     .post("/api/line")
  //     .send({
  //       startDockId: testDocks[2].id,
  //       endDockId: testDocks[4].id,
  //       stops: [
  //         { dockId: testDocks[5].id, delayFromStart: 24 },
  //         { dockId: testDocks[8].id, delayFromStart: 6 },
  //       ],
  //     });
  //   expect(response.status).toBe(201);
  // });
});
