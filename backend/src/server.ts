import express from "express";
import { connectToDatabase, collections } from "./db/database";
import { ObjectId } from "mongodb";

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

app.get("/api/polls/:id", async (req, res) => {
  try {
    const pollId = new ObjectId(req.params.id);
    const poll = await collections?.polls?.findOne({ _id: pollId });
    if (poll) {
      res.status(200).json(poll);
    } else {
      res.status(404).json({ error: "Poll not found" });
    }
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
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
      optionId: new ObjectId(),
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
      res.status(201).send({ _id: result.insertedId });
    } else {
      res.status(500).send("Failed to create poll");
    }
  } catch (error) {
    res
      .status(500)
      .send(error instanceof Error ? error.message : "Unknown error");
  }
});

app.post("/api/polls/:id/vote", async (req, res) => {
  const pollId = new ObjectId(req.params.id);
  const optionId = req.body.optionId;

  const result = await collections?.polls?.updateOne(
    { _id: pollId, "options.optionId": optionId },
    // increment the votes field of the matched option by 1
    { $inc: { "options.$.votes": 1 } }
  );

  if (result?.modifiedCount === 1) {
    res.status(200).json({ message: "Vote counted" });
  } else {
    res.status(404).json({ error: "Poll or option not found" });
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
