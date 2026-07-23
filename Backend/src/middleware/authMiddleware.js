const jwt = require("jsonwebtoken");
const redis = require("../config/cache");

const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  sameSite: isProduction ? "none" : "lax",
  secure: isProduction,
  path: "/",
};

async function authenticateUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "Token not provided" });
  }

  if (!process.env.SECRET_KEY) {
    console.error("SECRET_KEY is not configured");
    return res.status(500).json({ message: "Server configuration error" });
  }

  try {
    let isTokenBlacklisted = null;

    try {
      isTokenBlacklisted = await redis.get(`blacklist:${token}`);
    } catch (redisError) {
      console.error("Redis blacklist check failed:", redisError.message);
    }

    if (isTokenBlacklisted) {
      return res.status(401).json({ message: "Unauthorized access" });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.clearCookie("token", cookieOptions);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authenticateUser;
