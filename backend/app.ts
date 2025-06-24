import express from "express";
import path from "path";

import {
  requestLogger,
  errorHandler,
  unknownEndpoint,
} from "./util/middleware";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";
import dockRouter from "./routes/dockRoutes";

const app = express();
app.use(express.json());

app.get("/tese/", (_req, res) => {
  res.status(200).end();
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/dock", dockRouter);

const DIST_PATH = path.resolve(__dirname, "../frontend/build");

app.use(express.static(DIST_PATH));

app.use(requestLogger);

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
