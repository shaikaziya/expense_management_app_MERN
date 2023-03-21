import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, message, Table, DatePicker } from "antd";
import { UnorderedListOutlined, AreaChartOutlined, DeleteTwoTone, EditFilled } from "@ant-design/icons";
import Analytics from "../components/Analytics";
import Spinner from '../components/Spinner';
import Layout from '../components/Layout/Layout';
import moment from 'moment';
import { useGlobalContext } from '../context/GlobalContext';

const { RangePicker } = DatePicker;

const HomePage = () => {
    const { allTransactions, getTransactions, addTransaction, editTransaction, deleteTransaction } = useGlobalContext();
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [frequency, setFrequency] = useState("7");
    const [selectedDate, setSelectedDate] = useState([]);
    const [type, setType] = useState("all");
    const [viewData, setViewData] = useState("table");
    const [editable, setEditable] = useState(null);
    const [createTransaction, setCreateTransaction] = useState(null);

    useEffect(() => {
        getTransactions(frequency, selectedDate, type);
        //eslint-disable-next-line
    }, [frequency, selectedDate, type])

    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            render: (text) => <span>{moment(text).format("YYYY-MM-DD")}</span>,
        },
        {
            title: "Amount",
            dataIndex: "amount",
        },
        {
            title: "Type",
            dataIndex: "type",
        },
        {
            title: "Category",
            dataIndex: "category",
        },
        {
            title: "Reference",
            dataIndex: "reference",
        },
        {
            title: "Actions",
            render: (text, record) => (
                <div>
                    <EditFilled style={{ color: "skyblue" }}
                        onClick={() => {
                            setEditable(record);
                            setShowUpdateModal(true);
                        }}
                    />
                    <DeleteTwoTone twoToneColor="red" className='mx-3' onClick={() => handleDelete(record)} />
                </div>
            )
        },
    ];

    const updateTransaction = async () => {
        setLoading(true);
        await editTransaction(editable)
        setLoading(false);
        setEditable(null);
        setShowUpdateModal(false);
        message.success('Transaction updated successfully');
    }

    const newTransaction = async () => {
        setLoading(true);
        await addTransaction(createTransaction)
        setLoading(false);
        setShowAddModal(false);
        setCreateTransaction(null);
        message.success('Transaction added successfully');
    }

    const handleDelete = async (record) => {
        try {
            await deleteTransaction(record)
            message.success('Transaction deleted successfully');
        } catch (error) {
            setLoading(false);
            console.log(error);
            message.error('Unable to delete')
        }
    }

    return (
        <Layout>
            {loading && <Spinner />}
            <div className='filters'>
                <div>
                    <h6>Select Frequency</h6>
                    <Select style={{ width: 150 }} value={frequency} onChange={(values) => setFrequency(values)}>
                        <Select.Option value="7">Last 1 Week</Select.Option>
                        <Select.Option value="30">Last 1 Month</Select.Option>
                        <Select.Option value="365">Last 1 Year</Select.Option>
                        <Select.Option value="custom">Custom</Select.Option>
                    </Select>
                    {frequency === "custom" && (
                        <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
                    )}
                </div>
                <div>
                    <h6>Select Type</h6>
                    <Select style={{ width: 120 }} value={type} onChange={(values) => setType(values)}>
                        <Select.Option value="all">ALL</Select.Option>
                        <Select.Option value="Income">INCOME</Select.Option>
                        <Select.Option value="Expense">EXPENSE</Select.Option>
                    </Select>
                    {frequency === "custom" && (
                        <RangePicker value={selectedDate} onChange={(values) => setSelectedDate(values)} />
                    )}
                </div>
                <div className='switch-icons'>
                    <button className={`mx-2 p-2 btn btn-lg ${viewData === "table" ? "btn-secondary" : "btn-primary"}`} onClick={() => setViewData("table")} > <UnorderedListOutlined /></button>
                    <button className={`mx-2 p-2 btn btn-lg ${viewData === "analytics" ? "btn-secondary" : "btn-primary"}`} onClick={() => setViewData("analytics")} ><AreaChartOutlined /></button>
                </div>
                <div>
                    <button className='btn btn-primary' onClick={() => setShowAddModal(true)}>Add New</button>
                </div>
            </div>
            <div className='table-content'>
                {viewData === 'table' ?
                    <Table columns={columns} dataSource={allTransactions} rowKey={obj => obj._id} pagination={{ pageSize: 7 }} bordered /> :
                    <Analytics allTransactions={allTransactions} />}
            </div>

            <Modal title={"Add Transaction"} open={showAddModal} onCancel={() => { setShowAddModal(false); setCreateTransaction(null) }} footer={false}>
                <Form layout="vertical" >
                    <Form.Item label="Amount" >
                        <Input type="text" value={createTransaction?.amount} onChange={(e) => setCreateTransaction({ ...createTransaction, amount: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Type" >
                        <Select value={createTransaction?.type} onChange={(value) => setCreateTransaction({ ...createTransaction, type: value })}  >
                            <Select.Option value="Income">Income</Select.Option>
                            <Select.Option value="Expense">Expense</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Category" >
                        <Select value={createTransaction?.category} onChange={(value) => setCreateTransaction({ ...createTransaction, category: value })} >
                            <Select.Option value="Salary">Salary</Select.Option>
                            <Select.Option value="Tip">Tip</Select.Option>
                            <Select.Option value="Project">Project</Select.Option>
                            <Select.Option value="Food">Food</Select.Option>
                            <Select.Option value="Movie">Movie</Select.Option>
                            <Select.Option value="Bills">Bills</Select.Option>
                            <Select.Option value="Medical">Medical</Select.Option>
                            <Select.Option value="Fee">Fee</Select.Option>
                            <Select.Option value="Home">Home</Select.Option>
                            <Select.Option value="Tax">Tax</Select.Option>
                            <Select.Option value="Other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Date" >
                        <Input type="date" value={createTransaction?.date} onChange={(e) => setCreateTransaction({ ...createTransaction, date: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Reference" >
                        <Input type="text" value={createTransaction?.reference} onChange={(e) => setCreateTransaction({ ...createTransaction, reference: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Description">
                        <Input type="text" value={createTransaction?.description} onChange={(e) => setCreateTransaction({ ...createTransaction, description: e.target.value })} />
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <button type="button" onClick={newTransaction} className="btn btn-primary">
                            {" "}
                            SAVE
                        </button>
                    </div>
                </Form>
            </Modal>

            <Modal title={"Edit Transaction"} open={showUpdateModal} onCancel={() => { setEditable(null); setShowUpdateModal(false) }} footer={false}>
                <Form layout="vertical">
                    <Form.Item label="Amount">
                        <Input type="text" value={editable?.amount} onChange={(e) => setEditable({ ...editable, amount: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Type">
                        <Select value={editable?.type} onChange={(value) => setEditable({ ...editable, type: value })}>
                            <Select.Option value="Income">Income</Select.Option>
                            <Select.Option value="Expense">Expense</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Category">
                        <Select value={editable?.category} onChange={(value) => setEditable({ ...editable, category: value })}>
                            <Select.Option value="Salary">Salary</Select.Option>
                            <Select.Option value="Tip">Tip</Select.Option>
                            <Select.Option value="Project">Project</Select.Option>
                            <Select.Option value="Food">Food</Select.Option>
                            <Select.Option value="Movie">Movie</Select.Option>
                            <Select.Option value="Bills">Bills</Select.Option>
                            <Select.Option value="Medical">Medical</Select.Option>
                            <Select.Option value="Fee">Fee</Select.Option>
                            <Select.Option value="Home">Home</Select.Option>
                            <Select.Option value="Tax">Tax</Select.Option>
                            <Select.Option value="Other">Other</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Date">
                        <Input type="date" value={editable?.date} onChange={(e) => setEditable({ ...editable, date: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Reference">
                        <Input type="text" value={editable?.reference} onChange={(e) => setEditable({ ...editable, reference: e.target.value })} />
                    </Form.Item>
                    <Form.Item label="Description">
                        <Input type="text" value={editable?.description} onChange={(e) => setEditable({ ...editable, description: e.target.value })} />
                    </Form.Item>
                    <div className="d-flex justify-content-end">
                        <button onClick={updateTransaction} type="button" className="btn btn-primary">
                            {" "}
                            UPDATE
                        </button>
                    </div>
                </Form>
            </Modal>
        </Layout >
    )
}

export default HomePage
