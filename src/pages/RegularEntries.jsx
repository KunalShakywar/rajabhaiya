import { useState, useEffect } from "react";
import { FiTrash, FiEdit, FiEye, FiList } from "react-icons/fi";

import DataTable from "../components/DataTable";
import RegularEntryModal from "../components/RegularEntryModal";
import { supabase } from "../lib/supabase";
import { FcViewDetails } from "react-icons/fc";

const entryColumns = [
    { header: "Customer", accessor: "customerName" },
    { header: "Last Date", accessor: "date" },
    {
        header: "Qty",
        accessor: "qty",
        render: (row) => `${row.qty} ${row.unit}`,
    },
    {
        header: "Amount",
        accessor: "amount",
        render: (row) => `₹${row.amount}`,
    },
    {
        header: "Entries",
        accessor: "totalEntries",
    },
];
export default function RegularEntries() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scannedCustomer, setScannedCustomer] = useState(null);
    const [entries, setEntries] = useState([]);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyCustomer, setHistoryCustomer] = useState("");
    const [historyEntries, setHistoryEntries] = useState([]);

    const fetchEntries = async () => {
        const { data, error } = await supabase
            .from("regular_entries")
            .select(`
    *,
    customers (
      id,
      name
    )
  `)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }


        const grouped = {};

        data.forEach((item) => {
            const name = item.customers?.name || "Unknown";
            if (!grouped[name]) {
                grouped[name] = {
                    id: item.id,
                    customerId: item.customer_id,
                    date: item.entry_date,
                    customerName: name,
                    productName: item.product_name,
                    qty: 0,
                    unit: item.unit,
                    amount: 0,
                    totalEntries: 0,
                };
            }

            grouped[name].qty += Number(item.qty || 0);
            grouped[name].amount += Number(item.amount || 0);
            grouped[name].totalEntries += 1;
        });

        setEntries(Object.values(grouped));
    };

    useEffect(() => {
        fetchEntries();
    }, []);

    // Save entry
    const handleSave = async (rows) => {
        console.log("Rows received:", rows);

        const { data, error } = await supabase
            .from("regular_entries")
            .insert(rows)
            .select();

        if (error) {
            console.error(error);
            alert(error.message);
            return;
        };

        console.log("Saved:", data);

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
    // Fetch fucntion
    const openHistory = async (customerId, customerName) => {
        setHistoryCustomer(customerName);

        const { data, error } = await supabase
            .from("regular_entries")
            .select("*")
            .eq("customer_id", customerId)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setHistoryEntries(data || []);
        setHistoryOpen(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-lg lg:text-2xl font-bold">
                    Regular Entries
                </h1>

                <button
                    onClick={() => {
                        setScannedCustomer(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-green-600 text-sm lg:text-xl hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium cursor-pointer"
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
                        label: <FcViewDetails />,
                        className: "bg-blue-500 hover:bg-blue-600",
                        onClick: (row) =>
                            openHistory(row.customerId, row.customerName),
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
            {/* Customer History Modal */}
            {historyOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white w-full max-w-2xl rounded-xl shadow-xl">
                        <div className="flex items-center justify-between border-b p-4">
                            <div>
                                <h2 className="text-xl font-bold">Customer History</h2>
                                <p className="text-sm text-gray-500">{historyCustomer}</p>
                            </div>

                            <button
                                onClick={() => setHistoryOpen(false)}
                                className="text-gray-500 hover:text-black text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 max-h-[70vh] overflow-y-auto">
                            {historyEntries.length === 0 ? (
                                <p className="text-gray-500">No history found.</p>
                            ) : (
                                <div className="space-y-3">
                                    {historyEntries.map((item) => (
                                        <div
                                            key={item.id}
                                            className="border rounded-lg p-4 bg-gray-50"
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="font-semibold text-gray-800">
                                                    {item.product_name}
                                                </div>

                                                <div className="text-sm text-gray-500">
                                                    {new Date(item.created_at).toLocaleString("en-IN", {
                                                        dateStyle: "medium",
                                                        timeStyle: "short",
                                                    })}
                                                </div>
                                            </div>

                                            <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className="font-medium">Qty:</span>{" "}
                                                    {item.qty} {item.unit}
                                                </div>

                                                <div>
                                                    <span className="font-medium">Rate:</span>{" "}
                                                    ₹{item.rate}/{item.unit}
                                                </div>

                                                <div className="col-span-2 text-green-700 font-semibold">
                                                    Amount: ₹{item.amount}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}