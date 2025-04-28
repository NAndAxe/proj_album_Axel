import express from "express";
import cors from "cors";
import { initializeDatabase, dbAll, dbGet, dbRun } from "./util/database.js";

const app = express();
app.use(cors());
app.use(express.json());


app.get("/albumok", async (req, res, next) => {
  try {
    const albumok = await dbAll("SELECT * FROM albumok");
    res.json(albumok);
  } catch (err) {
    next(err);
  }
});


app.get("/albumok/:id", async (req, res, next) => {
  try {
    const album = await dbGet("SELECT * FROM albumok WHERE id = ?", [req.params.id]);
    if (!album) return res.status(404).json({ message: "Album nem található" });
    res.json(album);
  } catch (err) {
    next(err);
  }
});


app.post("/albumok", async (req, res, next) => {
  const { zenekar, cim, ev, stilus } = req.body;
  if (!zenekar || !cim || !ev || !stilus) {
    return res.status(400).json({ message: "Hiányzó adatok" });
  }
  try {
    const result = await dbRun(
      "INSERT INTO albumok (zenekar, cim, ev, stilus) VALUES (?, ?, ?, ?)",
      [zenekar, cim, ev, stilus]
    );
    res.status(201).json({ id: result.lastID, zenekar, cim, ev, stilus });
  } catch (err) {
    next(err);
  }
});


app.put("/albumok/:id", async (req, res, next) => {
  const { zenekar, cim, ev, stilus } = req.body;
  try {
    const result = await dbRun(
      "UPDATE albumok SET zenekar = ?, cim = ?, ev = ?, stilus = ? WHERE id = ?",
      [zenekar, cim, ev, stilus, req.params.id]
    );
    res.json({ message: "Album frissítve", id: req.params.id });
  } catch (err) {
    next(err);
  }
});


app.delete("/albumok/:id", async (req, res, next) => {
  try {
    await dbRun("DELETE FROM albumok WHERE id = ?", [req.params.id]);
    res.json({ message: "Album törölve" });
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  res.status(500).json({ message: `Szerverhiba: ${err.message}` });
});

async function startServer() {
  await initializeDatabase();
  app.listen(3000, () => {
    console.log("Server fut a 3000-es porton");
  });
}

startServer();
