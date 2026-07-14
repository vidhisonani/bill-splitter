const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const { check, validationResult } = require("express-validator");

exports.register = [
  check('email')
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  check('firstName')
    .trim()
    .notEmpty()
    .withMessage("First name is required"),
  check('lastName')
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),
  check('password')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
    .withMessage("Password must contain at least one special character"),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { firstName, lastName, email, password } = req.body;
      const normalizedEmail = email.trim().toLowerCase();

      // User Exist or not
      const userExist = await User.findOne({ email: normalizedEmail });
      if (userExist) {
        return res.status(400).json({ message: "User already exists" });
      };
      // Not exist create new user
      const user = await User.create({ firstName, lastName, email: normalizedEmail, password });
      const token = generateToken(user._id);
      return res.status(201).json({ message: "User Created", _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, token });
    } catch (err) {
      console.log("Something went wrong while registering process ", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }]

exports.login = [
  check('email')
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  check('password')
    .notEmpty()
    .withMessage("Password is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.trim().toLowerCase();
      const user = await User.findOne({ email: normalizedEmail }).select("+password");
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const matchPassword = await user.matchPassword(password);
      if (!matchPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const token = generateToken(user._id);
      return res.status(200).json({ message: "User Logged In", _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, token });
    } catch (err) {
      console.log("Error while Log in ", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }]

exports.getMe = async (req, res) => {
  try {
    return res.status(200).json(req.user);
  } catch (err) {
    console.log("Error in getMe", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.updateProfile = [
  check('email')
    .trim()
    .isEmail()
    .withMessage("Invalid email address")
    .normalizeEmail(),
  check('firstName')
    .trim()
    .notEmpty()
    .withMessage("First name is required"),
  check('lastName')
    .trim()
    .notEmpty()
    .withMessage("Last name is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { firstName, lastName, email } = req.body;
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (email && email.trim().toLowerCase() !== user.email) {
        const existing = await User.findOne({
          email: email.trim().toLowerCase(),
        });
        if (existing) {
          return res.status(400).json({ message: "Email already in use" });
        }
      }
      if (user) {
        user.firstName = firstName ? firstName.trim() : user.firstName;
        user.lastName = lastName ? lastName.trim() : user.lastName;
        user.email = email ? email.trim().toLowerCase() : user.email;
        await user.save();
      }
      return res.status(200).json({
        message: "Profile Updated", user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email
        }
      });
    } catch (err) {
      console.log("Error while updating profile.", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }]

exports.changePassword = [
  check('newPassword')
    .notEmpty()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/)
    .withMessage("Password must contain at least one special character"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id).select("+password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const isMatch = await user.matchPassword(currentPassword);
      if (!isMatch) {
        return res.status(400).json({ message: "Current password is incorrect" });
      }
      user.password = newPassword;
      await user.save();
      return res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
      console.log("Error while updating password", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }]