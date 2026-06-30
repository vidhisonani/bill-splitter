const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", protect, authController.getMe);


module.exports = authRouter;