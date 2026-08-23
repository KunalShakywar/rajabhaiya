import { useState } from "react";
import { useCustomers } from "../context/CustomerContext";
import { useProducts } from "../context/ProductContext";

export default function RegularEntryModal({
    isOpen,
    onClose,
    onSave,
    customer,
}) {
    const { customers } = useCustomers();
    const { products } = useProducts();

    const [form, setForm] = useState({
        date: new Date().toISOString().split("T")[0],
        customerId: customer?.id || "",
    });

    const [items, setItems] = useState([
        { productId: "", qty: 1, rate: 0, unit: "" },
    ]);

    if (!isOpen) return null;

    // Product select
    const handleProductChange = (index, productId) => {
        const product = products.find((p) => p.id === Number(productId));

        const updated = [...items];
        updated[index] = {
            ...updated[index],
            productId,
            rate: product?.rate || 0,
            unit: product?.unit || "",
        };

        setItems(updated);
    };

    // Qty / Rate change
    const updateItem = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    // Add row
    const addItem = () => {
        setItems([
            ...items,
            { productId: "", qty: 1, rate: 0, unit: "" },
        ]);
    };

    // Remove row
    const removeItem = (index) => {
        setItems(items.filter((_, i) => i !== index));
    };

    // Grand total
    const totalAmount = items.reduce(
        (sum, item) => sum + Number(item.qty) * Number(item.rate),
        0
    );
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Customer check
        if (!form.customerId) {
            alert("Please select customer");
            return;
        };

        const rows = items
            .filter((item) => item.productId)
            .map((item) => {
                const product = products.find(
                    (p) => p.id === Number(item.productId)
                );

                return {
                    customer_id: Number(form.customerId),
                    product_name: product?.name || "",
                    qty: Number(item.qty || 0),
                    unit: item.unit || "",
                    rate: Number(item.rate || 0),
                    amount: Number(item.qty || 0) * Number(item.rate || 0),
                    entry_date: form.date,
                };
            });

        console.log("Saving rows:", rows);

        if (rows.length === 0) {
            alert("Please select at least one product");
            return;
        };

        await onSave(rows);

        setForm({
            date: new Date().toISOString().split("T")[0],
            customerId: customer?.id || "",
        });

        setItems([{ productId: "", qty: 1, rate: 0, unit: "" }]);

        onClose();
    };

    const selInput = "w-full  rounded-lg border border-white dark:border-slate-700 px-3 py-2"
    return (
        <div className="fixed inset-0 z-50 bg-black/50 p-2 sm:p-4">
            <div className="mx-auto flex h-full max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-900 border border-white dark:border-slate-700 shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between shadow-md px-4 py-3 sm:px-6 flex-shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold">Add Regular Entry</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-2xl leading-none text-red-500 hover:text-gray-700 cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:px-6">
                    <form id="regular-entry-form" onSubmit={handleSubmit} className="space-y-5">

                        {/* Date */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">Date</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={(e) =>
                                    setForm({ ...form, date: e.target.value })
                                }
                                className={selInput}
                                required
                            />
                        </div>

                        {/* Customer */}
                        <div>
                            <label className="mb-1 block text-sm font-medium">Customer</label>
                            <select
                                value={form.customerId}
                                onChange={(e) =>
                                    setForm({ ...form, customerId: e.target.value })
                                }
                                className={selInput}
                                required
                            >
                                <option className="dark:bg-gray-800" value="">Select Customer</option>
                                {customers.map((c) => (
                                    <option className="dark:bg-gray-800" key={c.id} value={c.id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Product rows */}
                        <div className="space-y-4">
                            {items.map((item, index) => (
                                <div key={index} className="rounded-xl border border-white bg-white dark:bg-gray-900 dark:border-slate-700 p-4 space-y-3">
                                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                        <select
                                            value={item.productId}
                                            onChange={(e) =>
                                                handleProductChange(index, e.target.value)
                                            }
                                            className={selInput}
                                            required
                                        >
                                            <option className="dark:bg-gray-800" value="">Select Product</option>
                                            {products.map((p) => (
                                                <option className="dark:bg-gray-800 cursor-pointer" key={p.id} value={p.id}>
                                                    {p.name}
                                                </option>
                                            ))}
                                        </select>

                                        <input
                                            type="number"
                                            min="1"
                                            value={item.qty}
                                            onChange={(e) =>
                                                updateItem(index, "qty", e.target.value)
                                            }
                                            className={selInput}
                                        />

                                        <input
                                            type="number"
                                            value={item.rate}
                                            onChange={(e) =>
                                                updateItem(index, "rate", e.target.value)
                                            }
                                            className={selInput}
                                        />
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <p className="font-medium text-green-600 dark:text-green-400">
                                            Amount: ₹{Number(item.qty) * Number(item.rate)}
                                        </p>

                                        {items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                className="text-sm text-red-600 hover:text-red-700"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={addItem}
                            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 cursor-pointer"
                        >
                            + Add Product
                        </button>

                        <div className="rounded-xl border border-green-200 dark:border-slate-700 bg-green-50 dark:bg-green-900/10 p-4">
                            <p className="text-sm text-gray-600 dark:text-white">Grand Total</p>
                            <p className="text-2xl font-bold text-green-600 dark:text-green-400" >₹{totalAmount}</p>
                        </div>
                    </form>
                </div>

                {/* Fixed Footer */}
                <div className="flex justify-end gap-3  px-4 py-3 sm:px-6 shrink-0">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700 cursor-pointer"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        form="regular-entry-form"
                        className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 cursor-pointer"
                    >
                        Save Entry
                    </button>
                </div>
            </div>
        </div>
    );
}