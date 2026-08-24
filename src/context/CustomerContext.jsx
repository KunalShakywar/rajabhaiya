import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const CustomerContext = createContext();

export const CustomerProvider = ({ children }) => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);

    // FETCH CUSTOMERS
    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const {
                data: { user },
            } = await supabase.auth.getUser();

            const { data, error } = await supabase
                .from("customers")
                .select("id, name, phone, address, qty, milk_rate")
                .eq("user_id", user.id)
                .order("id", { ascending: false });

            if (error) throw error;
            // FORMATED DATA
            const formatted = data.map((item) => ({
                id: item.id,
                name: item.name,
                phone: item.phone,
                address: item.address,
                qty: Number(item.qty || 0),
                milkRate: Number(item.milk_rate || 0),

                extraItems: [], // abhi empty rakho
            }));

            setCustomers(formatted);
        } catch (err) {
            console.error("Fetch error:", err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let channel;

        const setupRealtime = async () => {
            await fetchCustomers();

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            channel = supabase
                .channel("customers-realtime")
                .on(
                    "postgres_changes",
                    {
                        event: "*",
                        schema: "public",
                        table: "customers",
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log("Realtime:", payload);
                        fetchCustomers();
                    }
                )
                .subscribe((status) => {
                    console.log("STATUS:", status);
                });
        };

        setupRealtime();

        return () => {
            if (channel) supabase.removeChannel(channel);
        };
    }, []);

    // ADD CUSTOMER
    const addCustomer = async (customer) => {
        //Get Logged User
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) throw new Error("User not logged in");

        const { data, error } = await supabase
            .from("customers")
            .insert([
                {
                    name: customer.name,
                    phone: customer.phone,
                    address: customer.address,
                    qty: customer.qty,
                    milk_rate: customer.milkRate,
                    user_id: user.id,   // Required for RLS
                },
            ])
            .select();

        if (error) throw error;

        const newCustomer = {
            id: data[0].id,
            name: data[0].name,
            phone: data[0].phone,
            address: data[0].address,
            qty: Number(data[0].qty || 0),
            milkRate: Number(data[0].milk_rate || 0),
            extraItems: [],
        };

        setCustomers((prev) => [newCustomer, ...prev]);
    };

    // DELETE CUSTOMER
    const deleteCustomer = async (id) => {
        const { error } = await supabase
            .from("customers")
            .delete()
            .eq("id", id);

        if (error) throw error;

        setCustomers((prev) => prev.filter((c) => c.id !== id));
    };

    return (
        <CustomerContext.Provider
            value={{
                customers,
                loading,
                fetchCustomers,
                addCustomer,
                deleteCustomer,
            }}
        >
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomers = () => useContext(CustomerContext);