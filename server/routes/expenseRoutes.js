const express = require("express");
const groupExpenseRouter = express.Router({ mergeParams: true });
const expenseRouter = express.Router();
const expenseController = require("../controllers/expenseController");
const { protect } = require('../middleware/authMiddleware');

expenseRouter.get("/", protect, expenseController.getMyExpenses);

// /api/groups/:id/expenses
groupExpenseRouter.post("/", protect, expenseController.addExpense);
groupExpenseRouter.get("/", protect, expenseController.getGroupExpenses);

// /api/expenses/:id
expenseRouter.delete("/:id", protect, expenseController.deleteExpense);

module.exports = { groupExpenseRouter, expenseRouter };