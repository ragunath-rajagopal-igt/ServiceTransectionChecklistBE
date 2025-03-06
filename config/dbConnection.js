const mongoose = require("mongoose");
require('dotenv').config();

// connection for database
const connectDb = async () => {
  try {
    const connect = await mongoose.connect(process.env.DATABASE_URL);
  } catch (err) {
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDb;
