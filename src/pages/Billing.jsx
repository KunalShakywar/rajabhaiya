import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import jsPDF from "jspdf";
import { autoTable } from "jspdf-autotable";
import { FaFilePdf, FaEye } from "react-icons/fa";

export default function ScannerPage() {
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [billItems, setBillItems] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        loadBills();
    }, []);
    // Download Pdf
    const downloadPDF = async (customer) => {
        // fresh data load karo
        const { data, error } = await supabase
            .from("regular_entries")
            .select("*")
            .eq("customer_id", customer.id)
            .order("created_at", { ascending: false });

        if (error || !data) {
            console.error(error);
            return;
        }

        const grandTotal = data.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        const doc = new jsPDF();

        // Header
        doc.setFontSize(20);
        doc.text("Shri Ganesh Dairy", 14, 20);

        doc.setFontSize(10);
        doc.text("Gwalior", 14, 28);
        doc.text(
            `Date: ${new Date().toLocaleDateString("en-IN")}`,
            150,
            28
        );

        // Customer
        doc.setFontSize(12);
        doc.text(`Customer: ${customer.name}`, 14, 42);
        doc.text(`Phone: ${customer.phone || "-"}`, 14, 50);

        // Table
        autoTable(doc, {
            startY: 60,
            head: [["Product", "Qty", "Rate", "Amount"]],
            body: data.map((item) => [
                item.product_name,
                `${item.qty} ${item.unit}`,
                `Rs. ${Number(item.rate).toFixed(2)}`,
                `Rs. ${Number(item.amount).toFixed(2)}`,
            ]),
            theme: "grid",
            headStyles: {
                fillColor: [229, 231, 235], // light gray
                textColor: [55, 65, 81],   // dark gray text
                fontStyle: "bold",
            },
            styles: {
                fontSize: 10,
                cellPadding: 4,
            },
        });

        // Total
        const finalY = (doc.lastAutoTable?.finalY || 60) + 12;

        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(
            `Grand Total:Rs ${grandTotal.toFixed(2)}`,
            130,
            finalY
        );

        // Footer
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text("Thank you for your purchase!", 14, finalY + 20);

        doc.save(`${customer.name}-bill.pdf`);
    };
    const loadBills = async () => {
        const { data, error } = await supabase
            .from("regular_entries")
            .select(`
                customer_id,
                amount,
                customers (
                    id,
                    name,
                    phone
                )
            `);

        if (error) {
            console.error(error);
            return;
        }

        // Customer wise total
        const grouped = {};

        data.forEach((item) => {
            const customer = item.customers;

            if (!customer) return;

            if (!grouped[customer.id]) {
                grouped[customer.id] = {
                    id: customer.id,
                    name: customer.name,
                    phone: customer.phone,
                    items: customer.item,
                    total: 0,
                };
            }

            grouped[customer.id].total += Number(item.amount || 0);
        });

        setCustomers(Object.values(grouped));
    };

    const openBill = async (customer) => {
        setSelectedCustomer(customer);

        const { data, error } = await supabase
            .from("regular_entries")
            .select("*")
            .eq("customer_id", customer.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setBillItems(data || []);

        const grandTotal = (data || []).reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        setTotal(grandTotal);
    };

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Final Bills</h1>

            {/* Customer List */}
            <div className="grid gap-3">
                {customers.map((customer) => (
                    <div
                        key={customer.id}
                        className="bg-white border rounded-xl p-4 flex items-center justify-between"
                    >
                        <div>
                            <div className="font-semibold text-gray-800">
                                {customer.name}
                            </div>
                            <div className="text-sm text-gray-500">
                                {customer.phone}
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="font-bold text-green-600">
                                ₹{customer.total.toFixed(2)}
                            </div>
                            <div className="flex  gap-2">

                                <button
                                    onClick={() => openBill(customer)}
                                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-lg text-sm"
                                >
                                    <FaEye />
                                </button>
                                <button
                                    onClick={() => downloadPDF(customer)}
                                    className="mt-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-sm"
                                >
                                    <FaFilePdf />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bill Modal */}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
                    <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl ">
                        <div className="flex items-center justify-between border-b p-4">
                            <div>
                                <h2 className="text-xl font-bold">
                                    {selectedCustomer.name}
                                </h2>
                                <p className="text-sm text-gray-500">
                                    {selectedCustomer.phone}
                                </p>

                            </div>

                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className="text-red-500 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="p-4 space-y-3 max-h-[60vh] overflow-y-auto">
                            {billItems.map((item, index) => (
                                <div
                                    key={item.id}
                                    className=" shadow-md rounded-lg p-3 flex items-center justify-between gap-3"
                                >
                                    {/* Index Number */}
                                    <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                                        {index + 1}
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-800">
                                            {item.product_name}
                                        </div>

                                        <div className="text-sm text-gray-500">
                                            {item.qty} {item.unit} × ₹{item.rate}
                                        </div>
                                    </div>

                                    {/* Amount */}
                                    <div className="font-semibold text-green-700">
                                        ₹{Number(item.amount).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t p-4 flex items-center justify-between">
                            <span className="font-bold text-lg">Grand Total</span>
                            <span className="font-bold text-xl text-green-700">
                                ₹{total.toFixed(2)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}