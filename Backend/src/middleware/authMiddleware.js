const jwt = require("jsonwebtoken");
const redis = require("../config/cache");

async function authenticateUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "Token not provided" });
  }

  const isTokenBlacklisted = await redis.get(`blacklist:${token}`);

  if (isTokenBlacklisted) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ message: "Invalid token" });
  }
}

module.exports = authenticateUser;
