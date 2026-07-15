const mongoose = require("mongoose");
const Expense = require("../models/Expense");
const Group = require("../models/Group");
const { check, validationResult } = require("express-validator");

exports.addExpense = [
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters long"),
  check("amount")
    .notEmpty()
    .withMessage("Amount is required")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than 0"),
  check("paidBy")
    .notEmpty()
    .withMessage("Paid by is required"),
  check("splitAmong")
    .isArray({ min: 1 })
    .withMessage("Split among must be an array with atleast 1 member"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { title, amount, paidBy, splitAmong } = req.body;
      const groupId = req.params.id;
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      const isMember = group.members.some(member => member.toString() === req.user._id.toString());
      if (!isMember) {
        return res.status(403).json({ message: "You are not a member of this group" });
      }
      const expense = await Expense.create({
        group: groupId,
        title,
        amount,
        paidBy,
        splitAmong,
        createdBy: req.user._id
      });
      return res.status(201).json({ message: "Expense added successfully", expense });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }]

exports.getGroupExpenses = async (req, res) => {
  try {
    const groupId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: "Invalid group id" });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const isMember = group.members.some(member => member.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }
    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "firstName lastName email")
      .populate("splitAmong", "firstName lastName email")
      .populate("createdBy", "firstName lastName email")
      .sort({ createdAt: -1 });;
    return res.status(200).json({ message: "Expenses fetched successfully", expenses });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(expenseId)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }
    if (expense.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" })
    }
    const settlementAfter = await Settlement.findOne({
      group: expense.group,
      createdAt: { $gte: expense.createdAt }
    });
    if (settlementAfter) {
      return res.status(400).json({
        message: "Cannot delete this expense as a settlement has been recorded after it was created."
      });
    }
    await expense.deleteOne();
    return res.status(200).json({ message: "Expense deleted successfully", expense })
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

exports.getMyExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({
      $or: [{ paidBy: req.user._id }, { splitAmong: req.user._id }]
    })
      .populate("paidBy", "firstName lastName email")
      .populate("splitAmong", "firstName lastName email")
      .populate("group", "name")
      .sort({ createdAt: -1 });
    return res.status(200).json({ message: "Expenses fetched successfully", expenses });
  } catch (err) {
    console.log("Error while fetching my expense", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getExpenseById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid expense id" });
    }
    const expense = await Expense.findById(req.params.id)
      .populate("createdBy", "firstName lastName")
      .populate("paidBy", "firstName lastName email")
      .populate("splitAmong", "firstName lastName email");
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }
    return res.status(200).json({ expense });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}