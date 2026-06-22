const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../config/cache");

const authCookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000,
  path: "/",
};

async function handleRegister(req, res) {
  try {
    const { username, email, password } = req.body;

    const isUserRegistered = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (isUserRegistered) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists" });
    }

    // ❌ REMOVE manual hashing
    // let schema handle it

    const newUser = await User.create({
      username,
      email,
      password, // 👈 plain password here
    });

    const payload = {
      id: newUser._id,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, authCookieOptions);

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, username: newUser.username },
    });
  } catch (error) {
    console.log("Error Message: ", error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password) {
      return res
        .status(400)
        .json({ message: "Email/Username and password are required" });
    }

    const userExist = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!userExist) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, userExist.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const payload = {
      id: userExist._id,
    };

    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "1d",
    });

    res.cookie("token", token, authCookieOptions);

    const userData = userExist.toObject();
    delete userData.password;

    return res.status(200).json({ message: "Logged In...", userData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
}

async function handleGetMe(req, res) {
  const userId = req.user.id;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User Not found" });
  }

  const userData = user.toObject();
  delete userData.password;

  return res.status(200).json({ message: "User fetched", userData });
}

async function handleLogout(req, res) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({ message: "Token not provided" });
  }

  try {
    // Keep token in Redis blacklist until JWT naturally expires.
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    // const ttlInSeconds = Math.max(decoded.exp - Math.floor(Date.now() / 1000), 1);

    await redis.set(`blacklist:${token}`, "1", "EX", 60*60);
  } catch (error) {
    // Even if token is invalid/expired, clear cookie for client-side logout.
    console.log("Error while blacklisting token:", error.message);
  }

  res.clearCookie("token", {
    ...authCookieOptions,
    maxAge: 0,
  });

  return res.status(200).json({ message: "Logout successful" });
}

module.exports = { handleLogin, handleRegister, handleGetMe, handleLogout };
