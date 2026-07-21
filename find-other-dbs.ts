import dotenv from "dotenv";
dotenv.config();
import { connectMongoose } from "./mongooseDb";
import mongoose from "mongoose";

async function run() {
  const conn = await connectMongoose();
  if (!conn) {
    console.error("DB connection failed.");
    return;
  }
  
  const adminDb = conn.connection.db?.admin();
  if (!adminDb) {
    console.error("Could not access admin db.");
    return;
  }

  try {
    const dbsList = await adminDb.listDatabases();
    console.log("DATABASES FOUND ON THE CLUSTER:", dbsList.databases.map(d => d.name));

    for (const dbInfo of dbsList.databases) {
      const dbName = dbInfo.name;
      if (["admin", "local", "config"].includes(dbName)) continue;

      console.log(`Checking database: ${dbName}`);
      const tempConn = await mongoose.createConnection(process.env.MONGODB_URI!, { dbName }).asPromise();
      const collections = await tempConn.db?.listCollections().toArray();
      console.log(`Collections in "${dbName}":`, collections?.map(c => c.name));

      if (collections) {
        for (const col of collections) {
          const count = await tempConn.db?.collection(col.name).countDocuments();
          console.log(`  Collection: ${col.name}, Doc Count: ${count}`);
          if (count > 0) {
            const sample = await tempConn.db?.collection(col.name).find().limit(1).toArray();
            console.log(`    Sample from ${col.name}:`, JSON.stringify(sample, null, 2));
          }
        }
      }
      await tempConn.close();
    }
  } catch (e: any) {
    console.error("Error listing databases or collections:", e.message || e);
  }

  process.exit(0);
}
run();
