import { useState, useEffect } from "react";

const ProductModal = ({ isOpen, onClose, onSave, editData }) => {
    const [form, setForm] = useState({
        name: "",
        unit: "L",
        rate: "",
    });

    useEffect(() => {
        if (editData) {
            setForm(editData);
        } else {
            setForm({ name: "", unit: "L", rate: "" });
        }
    }, [editData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            id: editData?.id || Date.now(),
            name: form.name,
            unit: form.unit,
            rate: Number(form.rate),
        });

        onClose();
    };

    if (!isOpen) return null;
    // css
    const selectInput = "w-full border border-slate-300 dark:border-slate-700 rounded-lg px-3 py-2";
    return (
        <div className="fixed inset-0 bg-black/40  flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 border border-white dark:border-slate-700 rounded-2xl shadow-xl w-full max-w-md p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold">
                        {editData ? "Edit Product" : "Add Product"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl cursor-pointer"
                    >
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Product Name
                        </label>
                        <input
                            type="text"
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            className={selectInput}
                            placeholder="Enter product name"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Unit</label>
                        <select
                            value={form.unit}
                            onChange={(e) =>
                                setForm({ ...form, unit: e.target.value })
                            }
                            className={selectInput}
                        >
                            <option className="dark:bg-gray-500" value="L">Litre (L)</option>
                            <option className="dark:bg-gray-500" value="Kg">Kilogram (Kg)</option>
                            <option className="dark:bg-gray-500" value="Piece">Piece</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Rate
                        </label>
                        <input
                            type="number"
                            min="0"
                            value={form.rate}
                            onChange={(e) =>
                                setForm({ ...form, rate: e.target.value })
                            }
                            className={selectInput}
                            placeholder="Enter rate"
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-white rounded-lg bg-red-600  hover:bg-red-700 cursor-pointer"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                        >
                            {editData ? "Update" : "Save Product"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;