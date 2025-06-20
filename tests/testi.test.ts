import request from "supertest";
import app from "../backend/app";
import db from "../backend/util/db";

describe("testing", () => {
  it("tese returns 200", async () => {
    const response = await request(app).get("/tese");
    expect(response.status).toBe(200);
    console.log("testi");
  });
  it("POST /login", async () => {
    await db.connectToDatabase().catch((e) => {
      if (e instanceof Error) {
        console.log(`Unable to connect database: ${e.message}`);
      }
    });
    const response = await request(app)
      .post("/auth/login")
      .send({ username: "hal", password: "salasana" });
    expect(response.status).toBe(200);
    console.log("testi2 ", response.body);
  });
});
