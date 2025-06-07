// backend/db.js
const mongoose = require("mongoose");
require("dotenv").config();

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("🟢 MongoDB conectado");
  } catch (err) {
    console.error("🔴 Error conectando a MongoDB", err);
    process.exit(1);
  }
}

module.exports = connectDB;
