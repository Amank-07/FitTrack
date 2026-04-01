const mongoose = require("mongoose");
const logger = require("./logger");

const connectDatabase = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured");
  }

  await mongoose.connect(uri);
  logger.info("MongoDB connected");
};

module.exports = connectDatabase;
