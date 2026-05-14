const { Router } = require("express");
const authController = require("../controller/auth.controller");
const authenticateUser = require("../middleware/authMiddleware");

const router = Router();

router.post("/register", authController.handleRegister);

router.post("/login", authController.handleLogin);

router.get("/get-me", authenticateUser, authController.handleGetMe);

router.post("/logout",authenticateUser, authController.handleLogout);



module.exports = router;