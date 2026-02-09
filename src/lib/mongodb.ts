import { MongoClient, Db } from "mongodb";

// Only initialize MongoDB connection on server side
if (typeof window !== "undefined") {
  throw new Error("MongoDB connection should only be used on the server side");
}

if (!process.env.NEXT_MONGO_URL) {
  throw new Error(
    "Please add your MongoDB URI to .env.local as NEXT_MONGO_URL",
  );
}

const uri = process.env.NEXT_MONGO_URL;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Database helper functions
export async function connectToDatabase(): Promise<{
  client: MongoClient;
  db: Db;
}> {
  // Ensure this only runs on server side
  if (typeof window !== "undefined") {
    throw new Error(
      "connectToDatabase should only be called on the server side",
    );
  }

  const client = await clientPromise;
  const db = client.db("tambo_dashboard"); // You can change this database name
  return { client, db };
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;
