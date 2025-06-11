import express from 'express';
import { connectToDatabase, getDb } from './database';

const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  const db = getDb();
  res.send('Response');
});

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to connect to database', err);
  process.exit(1);
});