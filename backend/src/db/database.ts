import * as mongodb from 'mongodb';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/polls'
const client = new mongodb.MongoClient(uri);

let db: mongodb.Db;

export async function connectToDatabase() {
  await client.connect();
  db = client.db();
  console.log('Connected to MongoDB');
}

export function getDb(): mongodb.Db {
  if (!db) throw new Error('Database not connected!');
  return db;
}