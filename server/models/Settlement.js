const mongoose = require("mongoose");

const settlementSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  paidBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  paidTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: [true, "Settlement amount is required"],
    min: [0.01, "Settlement amount must be greater than 0"]
  },
  note: {
    type: String,
    default: ""
  }
}, { timestamps: true })

module.exports = mongoose.model("Settlement", settlementSchema);