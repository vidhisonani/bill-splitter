const mongoose = require('mongoose');

const FriendRequestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending"
  },
  message: {
    type: String,
    trim: true,
    maxlength: [200, "Message cannot exceed 200 characters"],
    default: ""
  },

}, { timestamps: true })

module.exports = mongoose.model("FriendRequest", FriendRequestSchema);