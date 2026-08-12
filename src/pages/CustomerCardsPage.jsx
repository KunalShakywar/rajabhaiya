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
            setLoading(true);

            const { data, error } = await supabase
                .from("customers")
                .select("*")
                .eq("id", Number(id))
                .maybeSingle();

            console.log("PARAM ID =", id);
            console.log("CARD DATA =", data);

            if (error) {
                console.error("Supabase Error:", error);
            }

            setCustomer(data || null);
            setLoading(false);
        };

        if (id) {
            fetchCustomer();
        }
    }, [id]);

    if (loading) {
        return <div className="p-6">Loading...</div>;
    }

    if (!customer) {
        return (
            <div className="p-6 text-red-600">
                Customer not found
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <CustomerCard customer={customer} />
        </div>
    );
}