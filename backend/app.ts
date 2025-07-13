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
import lineRouter from "./routes/lineRoutes";
import departureRouter from "./routes/departureRoutes";

const app = express();
app.use(express.json());

app.get("/tese/", (_req, res) => {
  res.status(200).end();
});

app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/dock", dockRouter);
app.use("/api/line", lineRouter);
app.use("/api/departure", departureRouter);

const DIST_PATH = path.join(process.cwd(), "frontend", "build");

app.use(express.static(DIST_PATH));

app.get(/^\/(?!api).*/, (_req, res) => {
  const indexPath = path.join(process.cwd(), "frontend", "build", "index.html");
  res.sendFile(indexPath);
});

app.use(requestLogger);
app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
