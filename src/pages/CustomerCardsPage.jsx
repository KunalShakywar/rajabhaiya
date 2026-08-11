import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CustomerCard from "../components/CustomerCard";
import { supabase } from "../lib/supabase";

export default function CustomerCardPage() {
    const { id } = useParams();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            const { data, error } = await supabase
                .from("customers")
                .select("*")
                .eq("id", id)
                .single();

            console.log("CARD DATA =", data);

            if (error) {
                console.error(error);
            } else {
                setCustomer(data);
            }

            setLoading(false);
        };

        fetchCustomer();
    }, [id]);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!customer) {
        return <div className="p-6 text-red-600">Customer not found</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            <CustomerCard customer={customer} />
        </div>
    );
}