import express from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(cors());

app.get("/api/notes", async (req, res) => {
  const notes = await prisma.note.findMany();
  res.json(notes);
});

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("Data is messing");
  }

  try {
    const note = await prisma.note.create({
      data: {
        title,
        content,
      },
    });
    return res.json(note);
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).send("Data is messing");
  }
  const id = +req.params.id;
  if (!id || isNaN(id)) {
    res.status(400).send("Invalid number");
  }

  try {
    const note = await prisma.note.update({
      where: {
        id,
      },
      data: {
        content,
        title,
      },
    });
    return res.json(note);
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

app.delete("/api/notes/:id", async (req, res) => {
  const id = +req.params.id;
  if (!id || isNaN(id)) {
    res.status(400).send("Invalid number");
  }

  try {
    const note = await prisma.note.delete({
      where: {
        id,
      },
    });
    return res.status(200);
  } catch (err) {
    res.status(500).send("something went wrong");
  }
});

app.listen(5000, () => {
  console.log("server is running");
});
