require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors");

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN,
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
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
