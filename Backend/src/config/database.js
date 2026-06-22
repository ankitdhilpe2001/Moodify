const mongoose = require("mongoose");

async function connectToDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  } catch (error) {
    throw new Error("Somethin went wrong while connecting DB")
    console.log("Error connecting to database", error);
  }
}

module.exports = connectToDB;
