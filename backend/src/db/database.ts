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

async function applySchemaValidation(db: mongodb.Db) {
  const jsonSchema = {
    $jsonSchema: {
      bsonType: "object",
      required: ["title", "options"],
      properties: {
        _id: {},
        title: {
          bsonType: "string",
          description: "'title' is required and is a string",
        },
        options: {
          bsonType: "array",
          items: {
            bsonType: "object",
            required: ["text", "votes"],
            properties: {
              text: { bsonType: "string" },
              votes: { bsonType: "int" }
            }
          }
        }
      }
    }
  };

  //try applying the modification to the collection, and creates it if it doesn't exist
  await db.command({
    collMod: "polls",
    validator: jsonSchema
  })
  .catch(async (error: mongodb.MongoServerError) => {
    if (error.codeName === 'NamespaceNotFound') {
      await db.createCollection("polls", {validator: jsonSchema });
    }
  })
}