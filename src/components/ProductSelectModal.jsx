import { useState } from "react";

export default function ProductSelectorModal({
    customer,
    products,
    onSave,
    onClose,
}) {
    const [selected, setSelected] = useState([]);

    const toggleProduct = (product) => {
        const exists = selected.find((p) => p.id === product.id);

        if (exists) {
            setSelected(selected.filter((p) => p.id !== product.id));
        } else {
            setSelected([
                ...selected,
                { ...product, quantity: 1 },
            ]);
        }
    };

    const updateQty = (id, qty) => {
        setSelected(
            selected.map((p) =>
                p.id === id
                    ? { ...p, quantity: Number(qty) }
                    : p
            )
        );
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <h2 className="text-xl font-bold mb-4">
                    Add Products for {customer.name}
                </h2>

                <div className="space-y-3">
                    {products.map((product) => {
                        const checked = selected.some(
                            (p) => p.id === product.id
                        );

                        return (
                            <div
                                key={product.id}
                                className="border rounded-xl p-3 flex items-center justify-between"
                            >
                                <div>
                                    <p className="font-semibold">{product.name}</p>
                                    <p className="text-sm text-gray-500">
                                        ₹{product.rate}/{product.unit}
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() => toggleProduct(product)}
                                    />

                                    {checked && (
                                        <input
                                            type="number"
                                            min="1"
                                            value={
                                                selected.find((p) => p.id === product.id)
                                                    ?.quantity || 1
                                            }
                                            onChange={(e) =>
                                                updateQty(product.id, e.target.value)
                                            }
                                            className="w-20 border rounded-lg px-2 py-1"
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => onSave(selected)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Save Products
                    </button>
                </div>
            </div>
        </div>
    );
}