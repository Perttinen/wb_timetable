import express from "express";
import path from "path";
const app = express();
app.use(express.json());

const DIST_PATH = path.resolve(__dirname, "../build/frontend");

app.use(express.static(DIST_PATH));

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "../build/frontend/index.html"));
});

export default app;
