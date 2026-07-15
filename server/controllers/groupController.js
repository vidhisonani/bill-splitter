const Group = require("../models/Group");
const User = require("../models/User");
const Expense = require("../models/Expense");
const FriendRequest = require("../models/FriendRequest");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const Settlement = require("../models/Settlement");

exports.createGroup = [
  check("name")
    .trim()
    .notEmpty()
    .withMessage("Group name is required"),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { name, description } = req.body;
      const group = await Group.create({ name, description, createdBy: req.user._id, members: [req.user._id] });
      const populatedGroup = await Group.findById(group._id)
        .populate("members", "firstName lastName email")
        .populate("createdBy", "firstName lastName email");
      const groupObj = populatedGroup.toObject();
      groupObj.userBalance = 0;
      return res.status(201).json({ message: "Group Created", group: groupObj });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }]

exports.getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate("members", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");
    const groupsWithBalances = [];

    for (let group of groups) {
      const expenses = await Expense.find({ group: group._id });
      let userBalance = 0;

      expenses.forEach(exp => {
        const paidById = exp.paidBy?.toString();
        const amount = exp.amount;
        const splitAmongIds = exp.splitAmong?.map(id => id.toString()) || [];
        const splitCount = splitAmongIds.length;
        if (splitCount === 0) return;

        const share = amount / splitCount;

        if (paidById === req.user._id.toString()) {
          userBalance += amount;
        }

        if (splitAmongIds.includes(req.user._id.toString())) {
          userBalance -= share;
        }
      });

      const settlements = await Settlement.find({ group: group._id });
      settlements.forEach(settlement => {
        const paidById = settlement.paidBy.toString();
        const paidToId = settlement.paidTo.toString();
        const userId = req.user._id.toString();

        if (paidById === userId) {
          userBalance += settlement.amount;
        }
        if (paidToId === userId) {
          userBalance -= settlement.amount;
        }
      });
      const groupObj = group.toObject();
      groupObj.userBalance = userBalance;
      groupsWithBalances.push(groupObj);
    }
    groupsWithBalances.sort((a, b) => b.createdAt - a.createdAt);
    return res.status(200).json({ message: "Group Fetched", groups: groupsWithBalances });

  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}

exports.getGroupById = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid group id" });
    }
    const groupId = req.params.id;
    const group = await Group.findById(groupId)
      .populate("members", "firstName lastName email")
      .populate("createdBy", "firstName lastName email");
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const isMember = group.members.some(member => member._id.toString() === req.user._id.toString());
    if (!isMember) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }
    return res.status(200).json({ message: "Group Fetched", group });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.addMember = [
  check("email")
    .trim()
    .isEmail()
    .withMessage("Valid email is required")
    .normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const { email } = req.body;
      if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: "Invalid group id" });
      }
      const groupId = req.params.id;
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({ message: "Group not found" });
      }
      const isMember = group.members.some(id => id.toString() === req.user._id.toString());
      if (!isMember) {
        return res.status(403).json({ message: "You are not a member of this group" });
      }
      const member = await User.findOne({ email });
      if (!member) {
        return res.status(404).json({ message: "Member not found" });
      }
      if (member._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: "You are already a member of this group" });
      }
      if (group.members.includes(member._id)) {
        return res.status(400).json({ message: "Member already exists in this group" });
      }
      const areFriends = await FriendRequest.findOne({
        $or: [
          { sender: req.user._id, receiver: member._id },
          { sender: member._id, receiver: req.user._id }
        ],
        status: "accepted"
      });
      if (!areFriends) {
        return res.status(400).json({ message: "You can only add friends to groups. Send them a friend request first." });
      }
      group.members.push(member._id);
      await group.save();
      const updatedGroup = await Group.findById(group._id)
        .populate("members", "firstName lastName email")
        .populate("createdBy", "firstName lastName email");
      return res.status(200).json({ message: "Member added successfully", group: updatedGroup });
    } catch (err) {
      return res.status(500).json({ message: "Internal Server Error" })
    }
  }]

exports.deleteGroup = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid group id" });
    }
    const groupId = req.params.id;
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    if (group.createdBy.toString() === req.user._id.toString()) {
      await Expense.deleteMany({ group: groupId });
      await group.deleteOne();
      return res.status(200).json({ message: "Group deleted successfully" });
    }
    else {
      return res.status(403).json({ message: "You are not authorized to delete this group" });
    }
  }
  catch (err) {
    return res.status(500).json({ message: "Internal Server Error" })
  }
}