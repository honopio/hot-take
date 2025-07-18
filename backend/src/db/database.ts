import * as mongodb from "mongodb";

export const collections: {
  polls?: mongodb.Collection;
} = {};

let db: mongodb.Db;

export async function connectToDatabase(uri: string) {
  const client = new mongodb.MongoClient(uri);
  await client.connect();

  db = client.db();
  await applySchemaValidation(db);
  collections.polls = db.collection("polls");
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
            required: ["optionId", "text", "votes"],
            properties: {
              optionId: { bsonType: "objectId" },
              text: { bsonType: "string" },
              votes: { bsonType: "int" },
            },
          },
        },
      },
    },
  };

  //try applying the modification to the collection, and creates it if it doesn't exist
  await db
    .command({
      collMod: "polls",
      validator: jsonSchema,
    })
    .catch(async (error: mongodb.MongoServerError) => {
      if (error.codeName === "NamespaceNotFound") {
        await db.createCollection("polls", { validator: jsonSchema });
      }
    });
}
