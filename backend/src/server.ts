import express from "express";
import { connectToDatabase, collections } from "./db/database";
import { ObjectId } from "mongodb";
import createHttpError from "http-errors";

const app = express();
const port = process.env.PORT || 3000;
const mongodb_uri = process.env.MONGODB_URI || "";

app.use(express.json());

app.get("/api/polls/:id", async (req, res) => {
  if (!ObjectId.isValid(req.params.id)) {
    throw createHttpError(404, "Poll not found");
  }
  const pollId = new ObjectId(req.params.id);
  const poll = await collections?.polls?.findOne({ _id: pollId });
  if (!poll) {
    throw createHttpError(404, "Poll not found");
  }
  res.status(200).json(poll);
});

app.post("/api/polls", async (req, res) => {
  const { title, options } = req.body as { title: string; options: string[] };
  if (!title || !Array.isArray(options)) {
    throw createHttpError(400, "Title and options are required");
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
    throw createHttpError(500, "Failed to create poll");
  }
});

app.post("/api/polls/:id/vote", async (req, res) => {
  const pollId = ObjectId.createFromHexString(req.params.id);
  const optionId = ObjectId.createFromHexString(req.body.optionId);

  const result = await collections?.polls?.updateOne(
    { _id: pollId, "options.optionId": optionId },
    // increment the votes field of the matched option by 1
    { $inc: { "options.$.votes": 1 } }
  );

  if (result?.modifiedCount === 1) {
    res.status(200).json({ message: "Vote counted" });
  } else {
    throw createHttpError(404, "Poll or option not found");
  }
});

// Error handling middleware - must be defined AFTER all routes
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // If headers have already been sent, delegate to Express default error handler
    if (res.headersSent) {
      return next(err);
    }

    // Log the error for debugging
    console.error("Error occurred:", {
      message: err.message,
      status: err.status || err.statusCode || 500,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      path: req.path,
      method: req.method,
    });

    // Send error response
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
      error: {
        message,
        status,
      },
    });
  }
);

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
