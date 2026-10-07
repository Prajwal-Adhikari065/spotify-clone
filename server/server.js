import app from './src/app.js';
import dotenv from 'dotenv';
import {connectToDatabase} from './src/db/db.js';
import initializeDatabase from "./src/db/init.js";


dotenv.config();
const PORT = process.env.PORT;

async function startServer() {
  try {
    
await connectToDatabase();
    await initializeDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
}

startServer();