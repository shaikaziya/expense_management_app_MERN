const transactionModel = require('../models/transactionModel');
const moment = require("moment");

const getAllTransactions = async (req, res) => {
    try {
        const { frequency, selectedDate, type, userId } = req.body;
        const transactions = await transactionModel.find({
            ...(frequency !== "custom"
                ? {
                    date: {
                        $gt: moment().subtract(Number(frequency), "d").toDate(),
                    },
                }
                : {
                    date: {
                        $gte: selectedDate[0],
                        $lte: selectedDate[1],
                    },
                }),
            userId: userId,
            ...(type !== "all" && { type }),
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json(error);
    }
}

const editTransaction = async (req, res) => {
    try {
        await transactionModel.findOneAndUpdate({ _id: req.body.transactionId }, req.body.payload);
        const transactions = await transactionModel.find({ userId: req.body.userId })
        res.status(200).send(transactions);
    } catch (error) {
        res.status(500).json(error);
    }
}

const deleteTransaction = async (req, res) => {
    try {
        await transactionModel.findOneAndDelete({ _id: req.body.transactionId });
        const transactions = await transactionModel.find({ userId: req.body.userId })
        res.status(200).send(transactions);
    } catch (error) {
        res.status(500).json(error);
    }
}

const addTransaction = async (req, res) => {
    try {
        const newTransaction = new transactionModel(req.body);
        await newTransaction.save();
        const transactions = await transactionModel.find({ userId: req.body.userId })
        res.status(200).send(transactions);
    } catch (error) {
        res.status(500).json(error);
    }
}

module.exports = { getAllTransactions, addTransaction, editTransaction, deleteTransaction }