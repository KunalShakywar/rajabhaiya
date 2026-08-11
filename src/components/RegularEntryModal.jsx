import { useState, useEffect } from "react";

const products = [
    { id: 1, name: "Milk", unit: "L", rate: 60 },
    { id: 2, name: "Curd", unit: "Kg", rate: 80 },
    { id: 3, name: "Paneer", unit: "Kg", rate: 300 },
];

const customers = [
    { id: 1, name: "Raja Bhaiya" },
    { id: 2, name: "Ramesh" },
];

const RegularEntryModal = ({ isOpen, onClose, onSave, customer, }) => {
    const [form, setForm] = useState({
        date: new Date().toISOString().split("T")[0],
        customerId: "",
        productId: "",
        qty: 1,
        rate: 0,
        unit: "",
    });

    const amount = form.qty * form.rate;

    const handleProductChange = (productId) => {
        const product = products.find((p) => p.id === Number(productId));

        setForm({
            ...form,
            productId,
            rate: product?.rate || 0,
            unit: product?.unit || "",
        });
    };
    useEffect(() => {
        if (customer) {
            setForm((prev) => ({
                ...prev,
                customerName: customer.name,
            }));
        }
    }, [customer]);
    const handleSubmit = (e) => {
        e.preventDefault();

        const customer = customers.find(
            (c) => c.id === Number(form.customerId)
        );

        const product = products.find(
            (p) => p.id === Number(form.productId)
        );

        onSave({
            id: Date.now(),
            date: form.date,
            customerName: customer?.name,
            productName: product?.name,
            qty: Number(form.qty),
            unit: form.unit,
            rate: Number(form.rate),
            amount,
        });

        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">Add Regular Entry</h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Date</label>
                        <input
                            type="date"
                            value={form.date}
                            onChange={(e) =>
                                setForm({ ...form, date: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Customer</label>
                        <select
                            value={form.customerId}
                            onChange={(e) =>
                                setForm({ ...form, customerId: e.target.value })
                            }
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        >
                            <option value="">Select Customer</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Product</label>
                        <select
                            value={form.productId}
                            onChange={(e) => handleProductChange(e.target.value)}
                            className="w-full border rounded-lg px-3 py-2"
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                Quantity
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={form.qty}
                                onChange={(e) =>
                                    setForm({ ...form, qty: e.target.value })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Rate</label>
                            <input
                                type="number"
                                value={form.rate}
                                onChange={(e) =>
                                    setForm({ ...form, rate: e.target.value })
                                }
                                className="w-full border rounded-lg px-3 py-2"
                                required
                            />
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-sm text-gray-600">Total Amount</p>
                        <p className="text-xl font-bold text-green-600">₹{amount}</p>
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 rounded-lg text-white bg-red-600  hover:bg-red-700 cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                        >
                            Save Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegularEntryModal;