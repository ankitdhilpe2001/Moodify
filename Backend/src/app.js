const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors")
require("dotenv").config();
const corsOptions = {
  origin: process.env.FRONTEND_ORIGIN,
  credentials: true,
};


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

const authRouter = require("./routes/auth.routes");
const songRouter = require("./routes/song.routes");

// Routes
app.use("/api/auth", authRouter);
app.use("/api/songs", songRouter);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

module.exports = app
