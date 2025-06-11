import { connectToDatabase, collections } from "./database";

async function seedDatabase() {
  const mongodb_uri = process.env.MONGODB_URI || "";
  await connectToDatabase(mongodb_uri);

  const pollsData = [
    {
      title: "What's the best weather?",
      options: [
        { text: "sunny", votes: 0 },
        { text: "cloudy", votes: 0 },
        { text: "rainy", votes: 0 },
      ],
    },
    {
      title: "Favorite cat color",
      options: [
        { text: "black", votes: 0 },
        { text: "white", votes: 0 },
        { text: "orange", votes: 0 },
        { text: "gray", votes: 0 },
      ],
    },
  ];

  await collections.polls?.deleteMany({});
  const result = await collections.polls?.insertMany(pollsData);
  if (result?.acknowledged) {
    console.log(`Seeded ${result.insertedCount} polls into the database.`);
  } else {
    console.error("Failed to seed polls into the database.");
  }
}

seedDatabase();
