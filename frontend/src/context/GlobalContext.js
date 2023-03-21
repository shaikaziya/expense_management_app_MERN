import React, { createContext, useContext, useReducer } from "react";
import axios from "axios";

// initial state
const initialState = {
    user: JSON.parse(localStorage.getItem('user')),
    allTransactions: [],
};

// reducer
const globalReducer = (state, action) => {
    switch (action.type) {
        case "SET_TRANSACTIONS":
            return {
                ...state,
                allTransactions: action.payload,
            };
        case "RESET_USER":
            return {
                ...state,
                user: null,
                allTransactions: [],
            };
        default:
            return state;
    }
};

// create the context
export const GlobalContext = createContext(initialState);

// provider component
export const GlobalProvider = (props) => {
    const [state, dispatch] = useReducer(globalReducer, initialState);


    const getTransactions = async (frequency, selectedDate, type) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await axios.post("/api/v1/transactions/get-transactions", {
                userId: user.id,
                frequency,
                selectedDate,
                type
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            dispatch({
                type: "SET_TRANSACTIONS",
                payload: res.data
            });

        } catch (err) {
            console.log(err)
        }
    }

    const addTransaction = async (createTransaction) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await axios.post('/api/v1/transactions/add-transaction', { ...createTransaction, userId: user.id }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            dispatch({
                type: "SET_TRANSACTIONS",
                payload: res.data
            });
        } catch (err) {
            console.log(err);
        }
    };

    const editTransaction = async (editable) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await axios.post('/api/v1/transactions/edit-transaction', {
                payload: {
                    ...editable
                },
                transactionId: editable._id,
                userId: user.id,
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            dispatch({
                type: "SET_TRANSACTIONS",
                payload: res.data
            });
        } catch (err) {
            console.log(err);
        }
    };

    const deleteTransaction = async (record) => {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const res = await axios.post('/api/v1/transactions/delete-transaction', { transactionId: record._id, userId: user.id }, {
                headers: {
                    "Content-Type": "application/json"
                }
            })
            dispatch({
                type: "SET_TRANSACTIONS",
                payload: res.data
            }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
        } catch (err) {
            console.log(err);
        }
    };

    const logout = async () => {
        try {
            localStorage.removeItem('user');
            dispatch({ type: "RESET_USER" });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <GlobalContext.Provider value={{ user: state.user, allTransactions: state.allTransactions, addTransaction, editTransaction, deleteTransaction, logout, getTransactions }}>
            {props.children}
        </GlobalContext.Provider>
    );
};

export function useGlobalContext() {
    return useContext(GlobalContext);
}