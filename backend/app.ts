import express from "express";
import path from "path";

import {
  errorHandler,
  requestLogger,
  unknownEndpoint,
} from "./util/middleware";
import userRouter from "./routes/userRoutes";
import authRouter from "./routes/authRoutes";

const app = express();
app.use(express.json());

app.use("/userapi", userRouter);
app.use("/auth", authRouter);

const DIST_PATH = path.resolve(__dirname, "../frontend/build");

app.use(express.static(DIST_PATH));

app.use(requestLogger);

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/build/index.html"));
});

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
