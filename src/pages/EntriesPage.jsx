import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import QRScanner from "../components/QRScanner";

export default function EntriesPage() {
    const [customer, setCustomer] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [entries, setEntries] = useState([]);
    const [lastScan, setLastScan] = useState("");
    const today = new Date().toISOString().split("T")[0];

    const [selectedDate, setSelectedDate] = useState(today);

    // ---------------- LOAD DATA ----------------
    useEffect(() => {
        loadProducts();
        loadEntries();
    }, []);

    const loadProducts = async () => {
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .order("name");

        if (error) {
            console.error(error);
        } else {
            setProducts(data || []);
        }
    };

    const loadEntries = async (date = selectedDate) => {
        const { data, error } = await supabase
            .from("regular_entries")
            .select(`
      *,
      customers(id, name)
    `)
            .eq("entry_date", date)
            .order("created_at", { ascending: false });

        if (!error) setEntries(data || []);
    };
    useEffect(() => {
        loadEntries(selectedDate);
    }, [selectedDate]);

    // ---------------- QR SCAN ----------------
    const handleScan = async (value) => {
        if (!value) return;

        // Duplicate scan ignore
        if (value === lastScan) return;
        setLastScan(value);

        console.log("Scanned:", value);

        let customerId = null;

        try {
            const qrData = JSON.parse(value);
            customerId = Number(qrData.customerId);
        } catch (err) {
            customerId = Number(value);
        }

        if (!customerId || isNaN(customerId)) {
            alert("Invalid QR Code");
            return;
        }

        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .eq("id", customerId)
            .single();

        if (error || !data) {
            console.error(error);
            alert("Customer not found");
            return;
        }

        setCustomer(data);
        setSelectedProducts([]);
    };

    // ---------------- PRODUCT TOGGLE ----------------
    const toggleProduct = (product) => {
        setSelectedProducts((prev) => {
            const exists = prev.find((p) => p.id === product.id);

            if (exists) {
                return prev.filter((p) => p.id !== product.id);
            }

            return [...prev, { ...product, qty: "" }];
        });
    };

    // ---------------- UPDATE QTY ----------------
    const updateQty = (productId, value) => {
        setSelectedProducts((prev) =>
            prev.map((p) =>
                p.id === productId ? { ...p, qty: value } : p
            )
        );
    };
    const totalAmount = selectedProducts.reduce(
        (sum, item) => sum + Number(item.qty) * Number(item.rate),
        0
    )
    // ---------------- SAVE ENTRIES ----------------
    const saveEntry = async () => {
        if (!customer || selectedProducts.length === 0) {
            alert("Customer aur Product select karo");
            return;
        }

        const entriesToInsert = selectedProducts
            .filter((p) => Number(p.qty) > 0)
            .map((p) => ({
                entry_date: new Date().toISOString().split("T")[0],

                // customer_name hatao
                customer_id: customer.id,

                product_name: p.name,
                qty: Number(p.qty),
                unit: p.unit,
                rate: Number(p.rate),
                amount: Number(p.qty) * Number(p.rate),
            }));

        if (entriesToInsert.length === 0) {
            alert("At least one quantity enter karo");
            return;
        }

        const { error } = await supabase
            .from("regular_entries")
            .insert(entriesToInsert);

        if (error) {
            console.error("Save Error:", error);
            alert(error.message);
            return;
        }

        alert("Entries Saved Successfully");

        setCustomer(null);
        setSelectedProducts([]);
        setLastScan("");

        loadEntries();
    };
    // ---------------- DELETE ENTRY ----------------
    const deleteEntry = async (id) => {
        const confirmDelete = window.confirm("Kya aap is entry ko delete karna chahte ho?");

        if (!confirmDelete) return;

        const { error } = await supabase
            .from("regular_entries")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);
            alert("Delete failed");
            return;
        }

        // UI refresh
        loadEntries();
    }
    // Same customer ki entries ko group mai lana 
    // Same customer + same date ki entries ko group karo
    const groupedEntries = Object.values(
        entries.reduce((acc, entry) => {
            const key = `${entry.customer_id}-${entry.entry_date}`;

            if (!acc[key]) {
                acc[key] = {
                    customer_name: entry.customers?.name,
                    entry_date: entry.entry_date,
                    created_at: entry.created_at,
                    total: 0,
                    items: [],
                };
            }

            acc[key].total += Number(entry.amount || 0);
            acc[key].items.push(entry);

            return acc;
        }, {})
    );
    console.log(entries[0])
    // ---------------- UI ----------------
    return (
        <div>


            {/* QR Scanner */}
            <div>
                <h2 className="text-lg font-semibold mb-3">Scan Customer QR</h2>
                <QRScanner onScan={handleScan} />
            </div>

            {/* Customer + Product Selection */}
            {customer && (
                <div className="border border-white rounded-2xl p-5 bg-white  dark:bg-gray-900 dark:border-slate-700 shadow-sm space-y-5">
                    <div>
                        <h2 className="text-2xl font-bold dark:text-white" >
                            {customer.name}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-white">{customer.phone}</p>
                        <p className="text-sm text-gray-400">{customer.address}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Select Products</h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 ">
                            {products.map((product) => {
                                const selected = selectedProducts.some(
                                    (p) => p.id === product.id
                                );

                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => toggleProduct(product)}
                                        className={`border-[0.5px] rounded-xl p-4 text-left transition-all ${selected
                                            ? "border-blue-600 bg-blue-200 dark:bg-blue-500/10 shadow-sm"
                                            : "hover:border-blue-400 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="font-semibold text-gray-800 dark:text-white">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-200 mt-1">
                                            ₹{product.rate}/{product.unit}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quantity Inputs */}
                    {selectedProducts.length > 0 && (
                        <div className="space-y-4 border-t border-white dark:border-slate-700 pt-5">
                            <h3 className="font-semibold">Enter Quantities</h3>

                            {selectedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 space-y-3 bg-blue-50 dark:bg-gray-900"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium text-lg text-gray-800 dark:text-white">
                                            {product.name}
                                        </div>

                                        <div className="text-sm text-gray-500 dark:text-gray-200">
                                            ₹{product.rate}/{product.unit}
                                        </div>
                                    </div>

                                    <input
                                        type="number"
                                        step="0.1"
                                        placeholder={`Enter quantity in ${product.unit}`}
                                        value={product.qty}
                                        onChange={(e) =>
                                            updateQty(product.id, e.target.value)
                                        }
                                        className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                    />

                                    <div className="text-right text-green-600 font-bold">
                                        Total: ₹
                                        {(
                                            Number(product.qty || 0) * Number(product.rate || 0)
                                        ).toFixed(2)}
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={saveEntry}
                                className="w-full bg-blue-900 hover:bg-blue-500 text-white py-3 rounded-xl font-medium text-lg transition-colors"
                            >
                                Save Entries <span className="text-green-400">(₹{totalAmount})</span>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Entries */}
            <div className="pb-20 mt-4">
                <div className="flex items-center justify-between mb-4">

                    <h2 className="lg:text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                        Recent Entries <span className="bg-blue-400 px-2 rounded-full">{entries.length}</span>
                    </h2>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="border border-white dark:border-slate-700 rounded-lg px-3 py-2"
                    />
                </div>

                <div className="space-y-3">
                    {entries.length === 0 && (
                        <div className="text-center text-gray-500 py-6">
                            No entries found
                        </div>
                    )}

                    {groupedEntries.map((group, index) => (
                        <div
                            key={index}
                            className="bg-green-100 dark:bg-green-900/10 border dark:border-slate-700 rounded-xl p-4 mb-4  shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                                        {group.customer_name}
                                    </h3>

                                    <div className="text-xs text-gray-400">
                                        {new Date(group.entry_date).toLocaleDateString("en-IN", {
                                            timeZone: "Asia/Kolkata",
                                            dateStyle: "medium",
                                        })}
                                    </div>
                                </div>

                                <div className="text-right">
                                    <div className="text-sm text-gray-500">Total</div>
                                    <div className="font-bold text-green-600 text-xl">
                                        ₹{group.total.toFixed(2)}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2 border-t dark:border-slate-700 pt-3">
                                {group.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between text-sm rounded-lg"
                                    >
                                        <div>
                                            <div className="text-gray-700 dark:text-white font-medium">
                                                {item.product_name} • {item.qty} {item.unit}
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-white">
                                                ₹{item.rate}/{item.unit}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-yellow-800 dark:text-yellow-400">
                                                ₹{Number(item.amount).toFixed(2)}
                                            </span>

                                            <button
                                                onClick={() => deleteEntry(item.id)}
                                                className="text-red-600 hover:text-red-800 text-xs font-medium"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}