const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  wallet: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Wallet",
    required: true,
  },
  amount: { type: Number, required: true },
  balance: { type: Number, required: true, default: 0 },
  description: { type: String, required: true },
  type: { type: String, required: true, enum: ["CREDIT", "DEBIT"] },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Transaction", TransactionSchema);
