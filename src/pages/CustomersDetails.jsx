import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const CustomerDetails = () => {
    const { id } = useParams();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCustomer();
    }, [id]);

    const fetchCustomer = async () => {
        setLoading(true);

        const { data, error } = await supabase
            .from("customers")
            .select("*")
            .eq("id", id)
            .single();

        if (error) {
            console.error(error);
            setCustomer(null);
        } else {
            setCustomer({
                id: data.id,
                name: data.name,
                phone: data.phone,
                address: data.address,
                qty: Number(data.qty || 0),
                milkRate: Number(data.milk_rate || 0),
            });
        }

        setLoading(false);
    };

    if (loading) {
        return <div className="p-6">Loading customer...</div>;
    }

    if (!customer) {
        return <div className="p-6 text-red-600">Customer not found</div>;
    }

    const milkAmount = customer.qty * customer.milkRate;

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">{customer.name}</h1>

            <div className="bg-white border rounded-xl p-6 shadow space-y-3">
                <p>
                    <strong>Phone:</strong> {customer.phone}
                </p>

                <p>
                    <strong>Address:</strong> {customer.address || "No Address"}
                </p>

                <p>
                    <strong>Milk Rate:</strong> ₹{customer.milkRate}/L
                </p>

                <p>
                    <strong>Current Qty:</strong> {customer.qty} L
                </p>

                <div className="border-t pt-4 mt-4">
                    <p className="text-lg font-semibold text-green-700">
                        Current Amount: ₹{milkAmount}
                    </p>
                </div>
            </div>

            <div className="mt-8 bg-white border rounded-xl p-6 shadow">
                <h2 className="text-xl font-semibold mb-4">Yearly Records</h2>

                <div className="text-gray-500 text-sm">
                    No yearly records available yet.
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails;