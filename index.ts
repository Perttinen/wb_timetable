import express from "express";
import path from "path";
const app = express();
app.use(express.json());

const PORT = 3001;

const DIST_PATH = path.resolve(__dirname, "./build/frontend");
app.use(express.static(DIST_PATH));

app.get("/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.get("/", (_req, res) => {
  console.log(path.join(__dirname, "./build/frontend/index.html"));

  res.sendFile(
    path.join(__dirname, "./build/frontend/index.html"),
    function (err) {
      if (err) {
        console.log("errori!");

        res.status(500).send(err);
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
