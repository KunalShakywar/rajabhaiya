import { useState } from "react";

export default function AddCustomerModal({ open, onClose, onSubmit }) {
    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        qty: "",
        milkRate: "",
        extraItemName: "",
        extraItemAmount: "",
    });

    if (!open) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const customer = {
            name: form.name,
            phone: form.phone,
            address: form.address,
            qty: Number(form.qty),
            milkRate: Number(form.milkRate),
            extraItems: form.extraItemName
                ? [
                    {
                        name: form.extraItemName,
                        amount: Number(form.extraItemAmount || 0),
                    },
                ]
                : [],
        };

        onSubmit(customer);
        onClose();

        setForm({
            name: "",
            phone: "",
            address: "",
            qty: "",
            milkRate: "",
            extraItemName: "",
            extraItemAmount: "",
        });
    };
    // Input Css
    const InputStyle = "w-full rounded-lg border border-slate-700 p-2"
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Add Customer</h2>
                    <button onClick={onClose} className="text-2xl leading-none text-gray-500 hover:text-black cursor-pointer">
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        placeholder="Customer Name"
                        value={form.name}
                        onChange={handleChange}
                        className={InputStyle}
                        required
                    />

                    <input
                        name="phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={handleChange}
                        className={InputStyle}
                        required
                    />

                    <textarea
                        name="address"
                        placeholder="Address"
                        value={form.address}
                        onChange={handleChange}
                        className={InputStyle}
                        rows={3}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="number"
                            name="qty"
                            placeholder="Qty (L)"
                            value={form.qty}
                            onChange={handleChange}
                            className={InputStyle}
                            required
                        />

                        <input
                            type="number"
                            name="milkRate"
                            placeholder="Milk Rate"
                            value={form.milkRate}
                            onChange={handleChange}
                            className={InputStyle}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <input
                            name="extraItemName"
                            placeholder="Extra Item (Paneer)"
                            value={form.extraItemName}
                            onChange={handleChange}
                            className={InputStyle}
                        />

                        <input
                            type="number"
                            name="extraItemAmount"
                            placeholder="Amount"
                            value={form.extraItemAmount}
                            onChange={handleChange}
                            className={InputStyle}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg px-4 py-2 bg-red-500 hover:bg-red-700 text-white cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 cursor-pointer"
                        >
                            Save Customer
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}