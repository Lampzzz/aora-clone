import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connection = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log("Connected to Database");
  } catch (error) {
    console.error(error);
  }
};

export default connection;
