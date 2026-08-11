import { supabase } from "../lib/supabase";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash, FiEdit, FiEye } from "react-icons/fi";
import DataTable from "../components/DataTable";
import AddCustomerModal from "../components/AddCustomerModal";
import CustomerCardPage from "./CustomerCardsPage"

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
    const [customers, setCustomers] = useState([]);
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    // Fetch customers
    const fetchCustomers = async () => {
        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.error("Fetch error:", error);
            return;
        }

        const formatted = data.map((item) => ({
            id: item.id,
            name: item.name,
            phone: item.phone,
            address: item.address,
            qty: Number(item.qty),
            milkRate: Number(item.milk_rate),
            extraItems: [],
        }));

        setCustomers(formatted);
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Add customer
    const handleAddCustomer = async (customer) => {
        const { data, error } = await supabase
            .from("customers")
            .insert([
                {
                    name: customer.name,
                    phone: customer.phone,
                    address: customer.address,
                    qty: customer.qty,
                    milk_rate: customer.milkRate,
                },
            ])
            .select();

        console.log("DATA =", data);
        console.log("ERROR =", error);

        if (error) {
            alert(error.message);
            return;
        }

        await fetchCustomers();
        setOpen(false);
    };

    // Delete customer
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Delete this customer?");

        if (!confirmDelete) return;

        const { error } = await supabase
            .from("customers")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

        await fetchCustomers();
    };

    return (
        <>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-sm lg:text-xl font-bold">Customers</h1>

                <button
                    onClick={() => setOpen(true)}
                    className="rounded-lg bg-green-600 px-4 py-2 text-white text-sm lg:text-xl hover:bg-green-700 cursor-pointer"
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
                        label: "Card",
                        className: "bg-purple-500 hover:bg-purple-600 text-white cursor-pointer",
                        onClick: (row) => navigate(`/customers/${row.id}/card`),
                    },
                    {
                        label: <FiEye size={18} />,
                        className: "bg-blue-500 hover:bg-blue-600 cursor-pointer",
                        onClick: (row) => navigate(`/customers/${row.id}`),
                    },
                    {
                        label: <FiEdit size={18} />,
                        className: "bg-yellow-500 hover:bg-yellow-600 cursor-pointer",
                        onClick: (row) => console.log("Edit:", row),
                    },
                    {
                        label: <FiTrash size={18} />,
                        className: "bg-red-500 hover:bg-red-600 cursor-pointer",
                        onClick: (row) => handleDelete(row.id),
                    },
                ]}
            />

            <AddCustomerModal
                open={open}
                onClose={() => setOpen(false)}
                onSubmit={handleAddCustomer}
            />
        </>
    );
};

export default Customer;