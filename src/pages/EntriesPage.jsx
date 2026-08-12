import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import QRScanner from "../components/QRScanner";

export default function EntriesPage() {
    const [customer, setCustomer] = useState(null);
    const [products, setProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [entries, setEntries] = useState([]);
    const [lastScan, setLastScan] = useState("");

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

    const loadEntries = async () => {
        const { data, error } = await supabase
            .from("regular_entries")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(20);

        if (error) {
            console.error(error);
        } else {
            setEntries(data || []);
        }
    };

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
            customerId = qrData.customerId;
        } catch (err) {
            customerId = parseInt(value, 10);
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
                <div className="border rounded-2xl p-5 bg-white shadow-sm space-y-5">
                    <div>
                        <h2 className="text-2xl font-bold text-blue-700">
                            {customer.name}
                        </h2>
                        <p className="text-sm text-gray-500">{customer.phone}</p>
                        <p className="text-sm text-gray-400">{customer.address}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-3">Select Products</h3>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {products.map((product) => {
                                const selected = selectedProducts.some(
                                    (p) => p.id === product.id
                                );

                                return (
                                    <button
                                        key={product.id}
                                        onClick={() => toggleProduct(product)}
                                        className={`border rounded-xl p-4 text-left transition-all ${selected
                                            ? "border-blue-600 bg-blue-50 shadow-sm"
                                            : "hover:border-blue-400 hover:bg-gray-50"
                                            }`}
                                    >
                                        <div className="font-semibold text-gray-800">
                                            {product.name}
                                        </div>
                                        <div className="text-sm text-gray-500 mt-1">
                                            ₹{product.rate}/{product.unit}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Quantity Inputs */}
                    {selectedProducts.length > 0 && (
                        <div className="space-y-4 border-t pt-5">
                            <h3 className="font-semibold">Enter Quantities</h3>

                            {selectedProducts.map((product) => (
                                <div
                                    key={product.id}
                                    className="border rounded-xl p-4 space-y-3 bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="font-medium text-lg text-gray-800">
                                            {product.name}
                                        </div>

                                        <div className="text-sm text-gray-500">
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
                                        className="w-full border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium text-lg transition-colors"
                            >
                                Save All Entries
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Recent Entries */}
            <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                    Recent Entries
                </h2>

                <div className="space-y-3">
                    {entries.length === 0 && (
                        <div className="text-center text-gray-500 py-6">
                            No entries found
                        </div>
                    )}

                    {entries.map((entry) => (
                        <div
                            key={entry.id}
                            className="border rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                            <div>
                                <div className="font-semibold text-gray-800">
                                    {entry.customer_name}
                                </div>

                                <div className="text-sm text-gray-500">
                                    {entry.product_name} • {entry.qty} {entry.unit}
                                </div>

                                <div className="text-xs text-gray-400 mt-1">
                                    {new Date(entry.created_at).toLocaleString("en-IN", {
                                        timeZone: "Asia/Kolkata",
                                        dateStyle: "medium",
                                        timeStyle: "short",
                                    })}
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="font-bold text-green-600 text-lg">
                                    ₹{Number(entry.amount).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}