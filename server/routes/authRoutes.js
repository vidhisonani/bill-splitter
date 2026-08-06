const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const multer = require("multer");

// store uploads temporarily on disk before sending to cloudinary
const upload = multer({ dest: "uploads/" });

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", protect, authController.getMe);
authRouter.put("/profile", protect, authController.updateProfile);
authRouter.put("/password", protect, authController.changePassword);
authRouter.put("/avatar", protect, upload.single("avatar"), authController.uploadAvatar);

module.exports = authRouter;