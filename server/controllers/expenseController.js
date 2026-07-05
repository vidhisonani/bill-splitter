const Expense = require("../models/Expense");
const Group = require("../models/Group");


exports.addExpense = async (req, res) => {
  try {
    const { title, amount, paidBy, splitAmong } = req.body;
    const groupId = req.params.id;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
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
    console.log("Error while adding expense", err);
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
exports.getGroupExpenses = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const expenses = await Expense.find({ group: groupId })
      .populate("paidBy", "firstName lastName email")
      .populate("splitAmong", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");
    return res.status(200).json({ message: "Expenses fetched successfully", expenses });
  } catch (err) {
    console.log("Error while fetching expense", err);
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
exports.deleteExpense = async (req, res) => {
  try {
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" })
    }
    if (expense.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" })
    }
    await expense.deleteOne();
    return res.status(200).json({ message: "Expense deleted successfully", expense })
  } catch (err) {
    console.log("Error while deleting expense", err);
    return res.status(500).json({ message: "Internal Server Error" })
  }
}
exports.getMyExpenses = async (req, res) => {
  try{
    const expenses = await Expense.find({
      $or: [{paidBy : req.user._id}, {splitAmong: req.user._id}]
    })
    .populate("paidBy", "firstName lastName email")
    .populate("splitAmong", "firstName lastName email")
    .populate("group", "name")
    .sort({createdAt: -1});
    return res.status(200).json({message: "Expenses fetched successfully", expenses});
  }catch(err){
    console.log("Error while fetching my expense", err);
    return res.status(500).json({message: "Internal Server Error"});
  }
}
// exports.updateExpense = async (req, res) => {

// }