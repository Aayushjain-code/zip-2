const express = require("express");
const walletController = require("./controllers/walletController");

const router = express.Router();

router.post("/setup", walletController.setup);
router.post("/transact/:walletId", walletController.transact);
router.get("/transactions", walletController.getTransactions);
router.get("/wallet/:id", walletController.getWallet);
router.get("/wallets", walletController.getAllWallets);
router.get("/transactions/all", walletController.getAllTransactions);
module.exports = router;
