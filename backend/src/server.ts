import express from "express";
import { connectToDatabase, collections } from "./db/database";

const app = express();
const port = process.env.PORT || 3000;
const mongodb_uri = process.env.MONGODB_URI || "";

app.use(express.json());

app.get("/api/polls", async (req, res) => {
  try {
    const polls = await collections?.polls?.find({}).toArray();
    res.status(200).send(polls);
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Unknown error");
  }
});

app.post("/api/polls", async (req, res) => {
  try {
    const { title, options } = req.body as { title: string; options: string[] };
    if (!title || !Array.isArray(options)) {
      res.status(400).send("Invalid poll data");
      return;
    }
    const formattedOptions = options.map((option: string) => ({
      text: option,
      votes: 0,
    }));
    const newPoll = {
      title,
      options: formattedOptions,
      createdAt: new Date(),
    };
    const result = await collections?.polls?.insertOne(newPoll);
    if (result?.acknowledged) {
      res.status(201).send({ id: result.insertedId, ...newPoll });
    } else {
      res.status(500).send("Failed to create poll");
    }
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Unknown error");
  }
});

connectToDatabase(mongodb_uri)
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });
