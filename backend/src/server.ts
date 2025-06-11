import express from 'express';
import { connectToDatabase, getDb } from './db/database';

const app = express();
const port = process.env.PORT || 3000;
const mongodb_uri = process.env.MONGODB_URI || "";

app.get('/api/polls', async (req, res) => {
  const db = getDb();
  const collection = await db.collection('polls');
  const polls = await collection.find({}).toArray();
  res.json(polls).status(200);
});

connectToDatabase(mongodb_uri).then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to database', err);
  process.exit(1);
});