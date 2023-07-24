const mongoose = require("mongoose");

const WalletSchema = mongoose.Schema({
  balance: {
    type: Number,
    default: 0,
  },
  name: String,
});

module.exports = mongoose.model("Wallet", WalletSchema);
