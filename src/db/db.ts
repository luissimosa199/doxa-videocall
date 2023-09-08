import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGO_URI;

export const connectToDB = () => {
  if (MONGODB_URI) {
    mongoose
      .connect(MONGODB_URI, {})
      .then(() => {
        console.log("Connected to MongoDB");
      })
      .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
      });
  } else {
    console.error("ERROR, ENV VAR NOT FOUND")
  }
};
