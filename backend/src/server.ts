import express from "express";
import { createServer } from "http";
import { connectToDatabase, collections } from "./db/database";
import { ObjectId } from "mongodb";
import createHttpError from "http-errors";
import { Server } from "socket.io";

const app = express();
const port = process.env.PORT || 3000;
const mongodb_uri = process.env.MONGODB_URI || "";
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Get a poll
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

// Create a new poll
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

// Vote in a poll
app.post("/api/polls/:id/vote", async (req, res) => {
  const pollId = ObjectId.createFromHexString(req.params.id);
  const optionId = ObjectId.createFromHexString(req.body.optionId);

  const result = await collections?.polls?.updateOne(
    { _id: pollId, "options.optionId": optionId },
    { $inc: { "options.$.votes": 1 } }
  );

  if (result?.modifiedCount === 1) {
    const updatedPoll = await collections?.polls?.findOne({ _id: pollId });
    // Emit the updated data to all clients in this poll's room
    io.to(`poll-${req.params.id}`).emit("votesUpdated", updatedPoll);

    res.status(200).json({ message: "Vote counted" });
  } else {
    throw createHttpError(404, "Poll or option not found");
  }
});

// Error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // log the error
    console.error("Error occurred:", {
      message: err.message,
      status: err.status || err.statusCode || 500,
      stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      path: req.path,
      method: req.method,
    });

    // send error response
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message, status });
  }
);

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Handle joining a poll room
  socket.on("joinPoll", (pollId) => {
    socket.join(`poll-${pollId}`);
    console.log(`Socket ${socket.id} joined poll room: poll-${pollId}`);
  });

  // Handle leaving a poll room
  socket.on("leavePoll", (pollId) => {
    socket.leave(`poll-${pollId}`);
    console.log(`Socket ${socket.id} left poll room: poll-${pollId}`);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });
});
// Connect to the database and start the server
connectToDatabase(mongodb_uri)
  .then(() => {
    server.listen(port, () => {
      console.log(`Server is listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database", err);
    process.exit(1);
  });
