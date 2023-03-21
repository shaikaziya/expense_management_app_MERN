const express = require("express");
const { getAllTransactions, addTransaction, editTransaction, deleteTransaction } = require("../controllers/transactionController");

//router object
const router = express.Router();

router.post("/get-transactions", getAllTransactions);

router.post("/add-transaction", addTransaction);

router.post("/edit-transaction", editTransaction);

router.post("/delete-transaction", deleteTransaction);

module.exports = router;

