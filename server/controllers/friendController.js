const User = require("../models/User");
const FriendRequest = require("../models/FriendRequest");
const Group = require("../models/Group");
const Expense = require("../models/Expense");

exports.sendRequest = async (req, res) => {
  try {
    const { receiverEmail, message } = req.body;
    if (!receiverEmail) {
      return res.status(400).json({ message: "Email is required." });
    }
    const user = await User.findOne({ email: receiverEmail });
    if (!user) {
      return res.status(404).json({ message: "Receiver not found" });
    }
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot send request to yourself" });
    }
    const requestAlreadyExist = await FriendRequest.findOne({
      $or: [
        { sender: req.user._id, receiver: user._id },
        { sender: user._id, receiver: req.user._id }
      ],
      status: { $in: ["pending", "accepted"] }
    });
    if (requestAlreadyExist) {
      return res.status(400).json({ message: "Request already sent" });
    }
    const request = await FriendRequest.create({
      sender: req.user.id,
      receiver: user._id,
      message
    });
    return res.status(201).json({ message: "Request sent successfully" });

  } catch (err) {
    console.log("Error while sending request.", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({ receiver: req.user._id, status: "pending" })
      .populate("sender", "firstName lastName email");
    return res.status(200).json(requests);
  } catch (err) {
    console.log("Error while getting requests", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.respondToRequest = async (req, res) => {
  try {
    const requestId = req.params.id;
    const { status } = req.body;

    const request = await FriendRequest.findById(requestId)
      .populate("sender", "firstName lastName email");
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }
    if (request.receiver._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    } else {
      request.status = status;
      await request.save();
      return res.status(200).json({ message: "request updated" })
    }
  } catch (err) {
    console.log("Error while responding to friend request");
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getFriends = async (req, res) => {
  try {
    const friends = await FriendRequest.find({
      $or: [
        { sender: req.user._id, status: "accepted" },
        { receiver: req.user._id, status: "accepted" }
      ]
    }).populate("sender", "firstName lastName email")
      .populate("receiver", "firstName lastName email");
    return res.status(200).json(friends);
  } catch (err) {
    console.log("Error while fetching friends");
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.getFriendBalances = async (req, res) => {
  try {
    const userId = req.user._id;
    const friendRequest = await FriendRequest.find({
      $or: [
        { sender: req.user._id, status: "accepted" },
        { receiver: req.user._id, status: "accepted" }
      ]
    }).populate("sender", "firstName lastName email")
      .populate("receiver", "firstName lastName email");
    const friends = friendRequest.map(req => {
      return req.sender._id.toString() === userId.toString()
        ? req.receiver
        : req.sender
    });
    const balances = await Promise.all(friends.map(async (friend) => {
      const sharedGroups = await Group.find({
        members: { $all: [userId, friend._id] }
      });
      let netBalance = 0;
      for (const group of sharedGroups) {
        const expenses = await Expense.find({ group: group._id })
          .populate("splitAmong", "_id");
        expenses.forEach(exp => {
          const paidByMe = exp.paidBy.toString() === userId.toString();
          const paidByFriend = exp.paidBy.toString() === friend._id.toString();
          const splitIds = exp.splitAmong.map(m => m._id.toString());
          const iAmInSplit = splitIds.includes(userId.toString());
          const friendIsInSplit = splitIds.includes(friend._id.toString());
          const splitCount = splitIds.length;
          if (splitCount === 0) return;
          const share = exp.amount / splitCount;

          if (paidByMe && friendIsInSplit) {
            netBalance += share;
          }
          if (paidByFriend && iAmInSplit) {
            netBalance -= share;
          }
        })
      }
      return {
        friend,
        netBalance: parseFloat(netBalance.toFixed(2))
      };
    }))
    return res.status(200).json({ message: "Friend balances fetched", balances });
  } catch (err) {
    console.log("Error while fetching balances");
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

exports.cancelRequest = async (req, res) => {
  try {
    const request = await FriendRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found" });
    if (request.sender.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    if (request.status !== "pending") {
      return res.status(400).json({ message: "Can only cancel pending requests" });
    }
    await request.deleteOne();
    return res.status(200).json({ message: "Request cancelled" });
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.getSentRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      sender: req.user._id,
      status: "pending"
    }).populate("receiver", "firstName lastName email");
    return res.status(200).json(requests);
  } catch (err) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};