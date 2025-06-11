import express from 'express';
import { connectToDatabase, collections } from './db/database';

const app = express();
const port = process.env.PORT || 3000;
const mongodb_uri = process.env.MONGODB_URI || "";

app.get('/api/polls', async (req, res) => {
  try {
    const polls = await collections?.polls?.find({}).toArray();
    res.status(200).send(polls);
  } catch (error) {
    res.status(500).send(error instanceof Error ? error.message : "Unknown error");
  }
});

connectToDatabase(mongodb_uri).then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to database', err);
  process.exit(1);
});