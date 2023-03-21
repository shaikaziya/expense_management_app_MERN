import React from 'react';
import { Progress } from "antd";

const Analytics = ({ allTransactions }) => {
    //category
    const categories = ["Salary", "Tip", "Project", "Food", "Movie", "Bills", "Medical", "Fee", "Home", "Tax", "Other"];

    //total transaction
    const totalTransactions = allTransactions.length;

    const totalIncomeTransactions = allTransactions.filter((transaction) => transaction.type === "Income");
    const totalExpenseTransactions = allTransactions.filter((transaction) => transaction.type === "Expense");

    const totalIncomePercent = (totalIncomeTransactions.length / totalTransactions) * 100;
    const totalExpensePercent = (totalExpenseTransactions.length / totalTransactions) * 100;

    //total turnover
    const totalTurnover = allTransactions.reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalIncomeTurnover = allTransactions.filter((transaction) => transaction.type === "Income").reduce((acc, transaction) => acc + transaction.amount, 0);
    const totalExpenseTurnover = allTransactions.filter((transaction) => transaction.type === "Expense").reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalIncomeTurnoverPercent = (totalIncomeTurnover / totalTurnover) * 100;

    const totalExpenseTurnoverPercent = (totalExpenseTurnover / totalTurnover) * 100;

    return (
        <>
            <div className='row m-3'>
                <div className='col-md-4'>
                    <div className='card border-primary'>
                        <div className='card-header text-dark' style={{ backgroundColor: "#e1ebef" }}>
                            Total Transactions : {totalTransactions}
                        </div>
                        <div className='card-body'>
                            <h5 className='text-success'>
                                Income : {totalIncomeTransactions.length}
                            </h5>
                            <h5 className='text-danger'>
                                Expense : {totalExpenseTransactions.length}
                            </h5>
                            <div>
                                <Progress type="circle" strokeColor={"green"} className='mx-2' percent={totalIncomePercent.toFixed(0)} />
                                <Progress type="circle" strokeColor={"red"} className='mx-2' percent={totalExpensePercent.toFixed(0)} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='col-md-4'>
                    <div className='card border-primary'>
                        <div className='card-header text-dark' style={{ backgroundColor: "#e1ebef" }}>
                            Total Turnover : {totalTurnover}
                        </div>
                        <div className='card-body'>
                            <h5 className='text-success'>
                                Income : {totalIncomeTurnover}
                            </h5>
                            <h5 className='text-danger'>
                                Expense : {totalExpenseTurnover}
                            </h5>
                            <div>
                                <Progress type="circle" strokeColor={"green"} className='mx-2' percent={totalIncomeTurnoverPercent.toFixed(0)} />
                                <Progress type="circle" strokeColor={"red"} className='mx-2' percent={totalExpenseTurnoverPercent.toFixed(0)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='row mt-3 ms-3'>
                <div className='col-md-4'>
                    <h4>Category wise Income</h4>
                    {categories.map((category, id) => {
                        const amount = allTransactions.filter((transaction) => transaction.type === "Income" && transaction.category === category).reduce((acc, transaction) => acc + transaction.amount, 0);
                        return (
                            amount > 0 && (
                                <div className='card mt-3 border-primary' key={id}>
                                    <div className='card-body'>
                                        <h5>{category}</h5>
                                        <Progress percent={((amount / totalIncomeTurnover) * 100).toFixed(0)} />
                                    </div>
                                </div>
                            )
                        );
                    })}
                </div>
                <div className='col-md-4'>
                    <h4>Category wise Expense</h4>
                    {categories.map((category, id) => {
                        const amount = allTransactions.filter((transaction) => transaction.type === "Expense" && transaction.category === category).reduce((acc, transaction) => acc + transaction.amount, 0);
                        return (
                            amount > 0 && (
                                <div className='card mt-3 border-primary' key={id}>
                                    <div className='card-body'>
                                        <h5>{category}</h5>
                                        <Progress percent={((amount / totalExpenseTurnover) * 100).toFixed(0)} />
                                    </div>
                                </div>
                            )
                        );
                    })}
                </div>
            </div>
        </>
    )
}

export default Analytics
