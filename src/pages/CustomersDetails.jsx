import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const CustomerDetails = () => {
    const { id } = useParams();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            setLoading(true);

            // agar id integer hai table me
            const customerId = Number(id);

            const { data, error } = await supabase
                .from("customers")
                .select("*")
                .eq("id", customerId)
                .single();

            if (error) {
                console.error("Fetch error:", error.message);
                setCustomer(null);
            } else {
                setCustomer({
                    id: data.id,
                    name: data.name || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    qty: Number(data.qty ?? 0),
                    milkRate: Number(data.milk_rate ?? 0),
                });
            }

            setLoading(false);
        };

        if (id) {
            fetchCustomer();
        }
    }, [id]);

    if (loading) {
        return <div className="p-6">Loading customer...</div>;
    }

    if (!customer) {
        return (
            <div className="p-6 text-red-600 font-medium">
                Customer not found
            </div>
        );
    }

    const milkAmount = customer.qty * customer.milkRate;

    return (
        <div className=" mx-auto text-sm ">
            <h1 className="text-3xl font-bold mb-6">{customer.name}</h1>

            <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
                <div>
                    <span className="font-semibold">Phone:</span>{" "}
                    {customer.phone || "N/A"}
                </div>

                <div>
                    <span className="font-semibold">Address:</span>{" "}
                    {customer.address || "No Address"}
                </div>

                <div>
                    <span className="font-semibold">Milk Rate:</span>{" "}
                    ₹{customer.milkRate}/L
                </div>

                <div>
                    <span className="font-semibold">Current Qty:</span>{" "}
                    {customer.qty} L
                </div>

                <div className="border-t pt-4">
                    <p className="text-lg font-semibold text-green-700">
                        Current Amount: ₹{milkAmount.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-xl border shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Yearly Records</h2>

                <div className="text-sm text-gray-500">
                    No yearly records available yet.
                </div>
            </div>
        </div>
    );
};

export default CustomerDetails;