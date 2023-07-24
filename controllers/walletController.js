const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");

exports.setup = async (req, res) => {
  const initialBalance = req.body.balance || 0;
  const wallet = new Wallet({ ...req.body, balance: initialBalance });
  await wallet.save();

  res.status(200).json(wallet);
};

exports.transact = async (req, res) => {
  const { amount, description } = req.body;
  const walletId = req.params.walletId;

  // Ensure amount is a number
  const floatAmount = parseFloat(amount);
  if (isNaN(floatAmount)) {
    return res.status(400).json({ message: "Invalid transaction amount" });
  }

  // Use the walletId to find the wallet
  const wallet = await Wallet.findById(walletId);

  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  // Ensure wallet.balance is a number
  if (typeof wallet.balance !== "number") {
    return res.status(400).json({ message: "Invalid wallet balance" });
  }

  // Check if the transaction is a debit and if the wallet has enough balance
  if (floatAmount < 0 && wallet.balance < Math.abs(floatAmount)) {
    return res.status(403).json({
      message: "Insufficient balance",
    });
  }

  // Update the wallet balance
  wallet.balance += floatAmount;
  await wallet.save();

  const transaction = new Transaction({
    wallet: wallet._id,
    amount: floatAmount,
    balance: wallet.balance,
    description,
    type: floatAmount >= 0 ? "CREDIT" : "DEBIT",
  });

  await transaction.save();

  res.status(200).json({
    balance: wallet.balance,
    transactionId: transaction._id,
  });
};

exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find({ wallet: req.query.walletId })
    .populate("wallet", "name")
    .sort("-date")
    .skip(parseInt(req.query.skip))
    .limit(parseInt(req.query.limit));

  res.status(200).json(transactions);
};

exports.getWallet = async (req, res) => {
  const wallet = await Wallet.findById(req.params.id);

  if (!wallet) {
    return res.status(404).json({ message: "Wallet not found" });
  }

  res.status(200).json(wallet);
};
// ...

// Get all wallets
exports.getAllWallets = async (req, res) => {
  const wallets = await Wallet.find();

  if (!wallets) {
    return res.status(404).json({ message: "No wallets found" });
  }

  res.status(200).json(wallets);
};

// Get all transactions
exports.getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find();

  if (!transactions) {
    return res.status(404).json({ message: "No transactions found" });
  }

  res.status(200).json(transactions);
};
