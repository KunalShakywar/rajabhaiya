import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const CustomerDetails = () => {
    const { id } = useParams();

    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [summary, setSummary] = useState({
        day: 0,
        week: 0,
        month: 0,
        year: 0,
    });

    const fetchSummary = async (customerId) => {
        const { data, error } = await supabase
            .from("regular_entries")
            .select("customer_id, amount, created_at")
            .eq("customer_id", customerId);

        if (error) {
            console.error(error);
            return;
        }

        console.log("Customer ID:", customerId);
        console.log("Entries:", data);

        const now = new Date();

        let day = 0;
        let week = 0;
        let month = 0;
        let year = 0;

        data.forEach((item) => {
            const d = new Date(item.created_at);
            const amount = Number(item.amount || 0);

            // Today
            if (
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth() &&
                d.getDate() === now.getDate()
            ) {
                day += amount;
            }

            // Last 7 days
            const diffDays = (now - d) / (1000 * 60 * 60 * 24);
            if (diffDays >= 0 && diffDays < 7) {
                week += amount;
            }

            // This month
            if (
                d.getFullYear() === now.getFullYear() &&
                d.getMonth() === now.getMonth()
            ) {
                month += amount;
            }

            // This year
            if (d.getFullYear() === now.getFullYear()) {
                year += amount;
            }
        });

        setSummary({ day, week, month, year });
    }
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

                await fetchSummary(customerId);
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
        <div className=" mx-auto text-sm pb-20">
            <h1 className="text-3xl font-bold mb-6">{customer.name}</h1>

            <div className=" rounded-xl  space-y-4">
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



                <div className="border-t border-slate-200 dark:border-slate-700 pt-4">

                </div>
                <div className="grid grid-cols-2  md:grid-cols-4 gap-4 mt-6">
                    <div className="bg-blue-50 dark:bg-blue-900/10  border border-white dark:border-slate-700 shadow-md  rounded-xl p-4">
                        <p className="text-sm text-gray-500 dark:text-white">Today</p>
                        <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                            ₹{summary.day.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/10 border border-white dark:border-slate-700 shadow-md rounded-xl p-4">
                        <p className="text-sm text-gray-500 dark:text-white">This Week</p>
                        <p className="text-xl font-bold text-green-700 dark:text-green-400">
                            ₹{summary.week.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-white dark:border-slate-700 shadow-md rounded-xl p-4">
                        <p className="text-sm text-gray-500 dark:text-white" >This Month</p>
                        <p className="text-xl font-bold text-yellow-700 dark:text-yellow-400">
                            ₹{summary.month.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-purple-50 dark:bg-purple-900/10 border border-white dark:border-slate-700 shadow-md rounded-xl p-4">
                        <p className="text-sm text-gray-500 dark:text-white">This Year</p>
                        <p className="text-xl font-bold text-purple-700 dark:text-purple-400">
                            ₹{summary.year.toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CustomerDetails;