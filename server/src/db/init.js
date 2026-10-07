import fs from "fs";
import client from "./db.js";

async function initializeDatabase() {
   const schema = fs.readFileSync(
    "../database/schema.sql",
    "utf-8"
);

    await client.query(schema);

    console.log("Table Created successfully");
}

export default initializeDatabase;