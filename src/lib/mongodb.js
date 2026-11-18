import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

// Reuse client in development to prevent too many connections during hot reload
const globalForMongo = globalThis;

if (!globalForMongo._booknookMongoClient) {
  globalForMongo._booknookMongoClient = new MongoClient(uri);
}

const client = globalForMongo._booknookMongoClient;
export const db = client.db("booknookDB");
export default client;