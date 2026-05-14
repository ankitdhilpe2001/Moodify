const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const cors = require("cors")

const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};


app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

const authRouter = require("./routes/auth.routes");
const songRouter = require("./routes/song.routes");

// Routes
app.use("/api/auth", authRouter);
app.use("/api/songs",songRouter);

module.exports = app
