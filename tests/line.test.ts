import request from "supertest";

import app from "../backend/app";
import initializeDb from "./helpers/initializeTestDb";
import { login } from "./helpers/api";
import { TTestUser } from "../types/userTypes";
import { TDock } from "../types/dockTypes";
import { TLineResponse } from "../types/lineTypes";
import { TLoginResponse } from "../types/authTypes";

describe("Line API", () => {
  const hal: TTestUser = {} as TTestUser;
  let docks: TDock[] = [] as TDock[];
  let testLine: TLineResponse;

  beforeAll(async () => {
    const db = await initializeDb();
    if (!db) {
      throw new Error("Database initialization failed");
    }
    const { docksDb } = db;
    docks = docksDb;
    const halLogin = (await login("hal", process.env.HAL_PW!))
      .body as TLoginResponse;
    hal.token = halLogin.token;
  });

  test("Create line, POST /line", async () => {
    const payload = {
      startDockId: docks[0].id,
      endDockId: docks[3].id,
      stops: [
        {
          dockId: docks[1].id,
          delayFromStart: 30,
        },
        {
          dockId: docks[2].id,
          delayFromStart: 40,
        },
      ],
    };
    const response = await request(app)
      .post("/api/line")
      .set("Authorization", `Bearer ${hal.token}`)
      .send(payload);
    expect(response.status).toBe(201);
    testLine = response.body as TLineResponse;
  });

  test("Get line, GET /line/:id", async () => {
    const response = await request(app)
      .get(`/api/line/${testLine.id}`)
      .set("Authorization", `Bearer ${hal.token}`);
    expect(response.status).toBe(200);
  });

  test("Get lines, GET /line", async () => {
    const response = await request(app)
      .get(`/api/line`)
      .set("Authorization", `Bearer ${hal.token}`);
    expect(response.status).toBe(200);
  });

  test("Update line, PATCH /line/:id", async () => {
    const payload = {
      startDockId: docks[0].id,
      endDockId: docks[3].id,
      stops: [
        {
          dockId: docks[1].id,
          delayFromStart: 50,
        },
        {
          dockId: docks[2].id,
          delayFromStart: 60,
        },
      ],
    };
    const response = await request(app)
      .patch(`/api/line/${testLine.id}`)
      .set("Authorization", `Bearer ${hal.token}`)
      .send(payload);
    expect(response.status).toBe(200);
    const body = response.body as TLineResponse;
    expect(body.stopDocks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: docks[1].id, delayFromStart: 50 }),
        expect.objectContaining({ id: docks[2].id, delayFromStart: 60 }),
      ])
    );
  });

  test("Delete line, DELETE /line/:id", async () => {
    const response = await request(app)
      .delete(`/api/line/${testLine.id}`)
      .set("Authorization", `Bearer ${hal.token}`);
    expect(response.status).toBe(200);
  });
});
