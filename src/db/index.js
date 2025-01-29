import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    console.log(`Connecting to: ${process.env.MONGODB_URI}`);
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI.trim()}/${DB_NAME}`, {
 
    });
    console.log(`\nMongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed: ", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

export {connectDB};
