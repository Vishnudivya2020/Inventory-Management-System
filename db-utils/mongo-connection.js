import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

// MongoDB Connection Configuration
const dbName = process.env.DB_NAME || "";
const dbCluster = process.env.DB_CLUSTER || "localhost:27017";
const dbUserName = process.env.DB_USER || "";
const dbPassword = process.env.DB_PASSWORD || "";

// Local MongoDB URI
const localUri = `mongodb://${dbCluster}/${dbName}`;

// Cloud MongoDB URI (MongoDB Atlas)
const cloudUri = `mongodb+srv://${dbUserName}:${dbPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(cloudUri);  // Choose the appropriate URI here

const db = client.db(dbName);

const connectToDb = async () => {
  try {
    await client.connect();  // No URI should be passed here
    console.log("DB Connected Successfully");
  } catch (err) {
    console.error("Error Connecting to MongoDB:", err);
    process.exit(1);  // Exit process with failure
  }
};

export { db };
export default connectToDb;
