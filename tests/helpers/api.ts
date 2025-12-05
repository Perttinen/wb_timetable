import request from "supertest";
import app from "../../backend/app";

export const login = async (username: string, password: string) => {
  const response = await request(app)
    .post("/api/auth/login")
    .send({ username, password });
  return response;
};

export const createUser = async (token: string, payload: any) => {
  return request(app)
    .post("/api/user")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);
};

export const createDock = async (token: string, payload: any) => {
  return request(app)
    .post("/api/dock")
    .set("Authorization", `Bearer ${token}`)
    .send(payload);
};
