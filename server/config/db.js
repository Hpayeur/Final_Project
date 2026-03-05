const mongoose = require("mongoose");

const dpPath = process.env.MONGODB_URI;

const connectDB = async () => {
  try {
    await mongoose.connect(dpPath);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
