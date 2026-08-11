import { useState, useEffect } from "react";
import { FiTrash, FiEdit, FiEye } from "react-icons/fi";

import DataTable from "../components/DataTable";
import RegularEntryModal from "../components/RegularEntryModal";
import { supabase } from "../lib/supabase";

const entryColumns = [
    { header: "Date", accessor: "date" },
    { header: "Customer", accessor: "customerName" },
    { header: "Product", accessor: "productName" },
    {
        header: "Qty",
        accessor: "qty",
        render: (row) => `${row.qty} ${row.unit}`,
    },
    {
        header: "Rate",
        accessor: "rate",
        render: (row) => `₹${row.rate}/${row.unit}`,
    },
    {
        header: "Amount",
        accessor: "amount",
        render: (row) => `₹${row.amount}`,
    },
];

export default function RegularEntries() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scannedCustomer, setScannedCustomer] = useState(null);
    const [entries, setEntries] = useState([]);

    // Fetch entries
    const fetchEntries = async () => {
        const { data, error } = await supabase
            .from("regular_entries")
            .select("*")
            .order("id", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        const formatted = data.map((item) => ({
            id: item.id,
            date: item.entry_date,
            customerName: item.customer_name,
            productName: item.product_name,
            qty: Number(item.qty),
            unit: item.unit,
            rate: Number(item.rate),
            amount: Number(item.amount),
        }));

        setEntries(formatted);
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    // Save entry
    const handleSave = async (newEntry) => {
        const { error } = await supabase
            .from("regular_entries")
            .insert([
                {
                    entry_date: newEntry.date,
                    customer_name: newEntry.customerName,
                    product_name: newEntry.productName,
                    qty: Number(newEntry.qty),
                    unit: newEntry.unit,
                    rate: Number(newEntry.rate),
                    amount: Number(newEntry.amount),
                },
            ]);

        if (error) {
            console.error(error);
            alert("Entry save nahi hui");
            return;
        }

        await fetchEntries();
        setIsModalOpen(false);
    };

    // Delete entry
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this entry?")) return;

        const { error } = await supabase
            .from("regular_entries")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

        await fetchEntries();
    };

    // QR scan
    const handleScan = (text) => {
        try {
            const data = JSON.parse(text);
            setScannedCustomer(data);
            setIsModalOpen(true);
        } catch (err) {
            console.error("Invalid QR:", err);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg lg:text-2xl font-bold">
                    Regular Entries
                </h1>

                <button
                    onClick={() => {
                        setScannedCustomer(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
                >
                    + Add Entry
                </button>
            </div>



            <DataTable
                columns={entryColumns}
                data={entries}
                searchKeys={["customerName", "productName", "date"]}
                rowsPerPage={5}
                actions={[
                    {
                        label: <FiEye />,
                        className: "bg-blue-500 hover:bg-blue-600",
                        onClick: (row) => console.log("View:", row),
                    },
                    {
                        label: <FiEdit />,
                        className: "bg-yellow-500 hover:bg-yellow-600",
                        onClick: (row) => console.log("Edit:", row),
                    },
                    {
                        label: <FiTrash />,
                        className: "bg-red-500 hover:bg-red-600",
                        onClick: (row) => handleDelete(row.id),
                    },
                ]}
            />

            <RegularEntryModal
                isOpen={isModalOpen}
                customer={scannedCustomer}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
            />
        </div>
    );
}