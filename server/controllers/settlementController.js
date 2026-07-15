const Settlement = require("../models/Settlement");
const Group = require("../models/Group");
const User = require("../models/User");

exports.settleUp = async (req, res) => {
  try {
    const paidBy = req.user._id;
    const { paidTo, amount } = req.body;
    const groupId = req.params.id;
    if (!groupId) {
      return res.status(400).json({ message: "Group id is required" });
    }
    if (!paidTo || !amount) {
      return res.status(400).json({ message: "Paid by, Paid to and amount are required" });
    }
    if (paidBy.toString() === paidTo.toString()) {
      return res.status(400).json({ message: "Paid by and Paid to cannot be same" });
    }
    if (amount <= 0) {
      return res.status(400).json({ message: "Amount must be greater than 0" });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const paidByUser = await User.findById(paidBy);
    if (!paidByUser) {
      return res.status(404).json({ message: "Paid by user not found" });
    }
    const paidToUser = await User.findById(paidTo);
    if (!paidToUser) {
      return res.status(404).json({ message: "Paid to user not found" });
    }
    const isMember = (id) => group.members.some(m => m.toString() === id.toString());
    if (!isMember(req.user._id.toString())) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }
    const settlement = await Settlement.create({ group: groupId, paidBy: paidBy, paidTo: paidTo, amount });
    return res.status(201).json({ message: "Settlement created", settlement });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getGroupSettlements = async (req, res) => {
  try {
    const groupId = req.params.id;
    if (!groupId) {
      return res.status(400).json({ message: "Group id is required" });
    }
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const isMember = (id) => group.members.some(m => m.toString() === id.toString());
    if (!isMember(req.user._id.toString())) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }
    const settlements = await Settlement.find({ group: groupId })
      .populate("paidBy paidTo", "firstName lastName email");
    return res.status(200).json({ settlements });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}