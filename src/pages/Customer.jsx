import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash, FiEdit, FiEye } from "react-icons/fi";
import DataTable from "../components/DataTable";
import AddCustomerModal from "../components/AddCustomerModal";
import CustomerCardPage from "./CustomerCardsPage"
import { FaIdCard } from "react-icons/fa";
import { useCustomers } from "../context/CustomerContext";

// Helpers
const getExtraTotal = (items = []) =>
    items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

const getMilkAmount = (row) =>
    Number(row.qty || 0) * Number(row.milkRate || 0);

const getFinalPay = (row) =>
    getMilkAmount(row) + getExtraTotal(row.extraItems);

const columns = [
    { accessor: "name", header: "Customer" },
    { accessor: "phone", header: "Phone" },
    {
        accessor: "address",
        header: "Address",
        render: (row) => row.address || "No Address",
    },
    {
        accessor: "qty",
        header: "Qty (L)",
        render: (row) => `${row.qty} L`,
    },
    {
        accessor: "milkRate",
        header: "Milk Rate",
        render: (row) => `₹${row.milkRate}/L`,
    },
    {
        accessor: "extraTotal",
        header: "Extra Total",
        render: (row) => `₹${getExtraTotal(row.extraItems)}`,
    },
    {
        accessor: "finalPay",
        header: "Final Pay",
        render: (row) => (
            <span className="font-semibold text-green-600">
                ₹{getFinalPay(row)}
            </span>
        ),
    },
];

const Customer = () => {
    const [open, setOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const navigate = useNavigate();
    const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
    // Add customer
    const handleAddCustomer = async (customer) => {
        try {
            if (editingCustomer) {
                // EDIT
                await updateCustomer(editingCustomer.id, customer);
            } else {
                // ADD
                await addCustomer(customer);
            }

            setOpen(false);
            setEditingCustomer(null);
        } catch (err) {
            console.error(err);
            alert(err.message);
        }
    };

    // Delete customer
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this customer?")) return;

        try {
            await deleteCustomer(id);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <p>Loading customers...</p>;

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-sm lg:text-xl font-bold">Customers</h1>

                <button
                    onClick={() => {
                        setEditingCustomer(null);
                        setOpen(true);
                    }}
                    className="bg-green-600 border border-green-800  text-sm lg:text-xl hover:bg-green-700 text-white px-4 py-1 rounded-lg font-medium cursor-pointer"
                >
                    + Add New Customer
                </button>
            </div>

            <DataTable
                columns={columns}
                data={customers}
                searchKeys={["name", "phone", "address"]}
                rowsPerPage={5}
                actions={[
                    {
                        label: <FaIdCard />,
                        className:
                            "bg-purple-500 hover:bg-purple-600 text-white cursor-pointer border border-purple-700",
                        onClick: (row) =>
                            navigate(`/dairy/customers/${row.id}/card`),
                    },
                    {
                        label: <FiEye size={18} />,
                        className:
                            "bg-blue-500 hover:bg-blue-600 cursor-pointer border border-blue-700",
                        onClick: (row) => navigate(`/dairy/customers/${row.id}`),
                    },
                    {
                        label: <FiEdit size={18} />,
                        className:
                            "bg-yellow-500 hover:bg-yellow-600 cursor-pointer border border-yellow-700",
                        onClick: (row) => {
                            setEditingCustomer(row);
                            setOpen(true);
                        },
                    },
                    {
                        label: <FiTrash size={18} />,
                        className: "bg-red-500 hover:bg-red-700 cursor-pointer border border-yellow-700",
                        onClick: (row) => handleDelete(row.id),
                    },
                ]}
            />

            <AddCustomerModal
                open={open}
                customer={editingCustomer}
                onClose={() => {
                    setOpen(false);
                    setEditingCustomer(null);
                }}
                onSubmit={handleAddCustomer}
            />
        </>
    );
};

export default Customer;