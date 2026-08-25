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

            // No logged-in user
            if (!user) {
                setCustomers([]);
                return;
            }

            const { data, error } = await supabase
                .from("customers")
                .select("id, name, phone, address, qty, milk_rate")
                .eq("user_id", user.id)
                .order("id", { ascending: false });

            if (error) throw error;

            const formattedCustomers = (data || []).map((item) => ({
                id: item.id,
                name: item.name,
                phone: item.phone,
                address: item.address,
                qty: Number(item.qty || 0),
                milkRate: Number(item.milk_rate || 0),
                extraItems: [],
            }));

            console.log("CUSTOMERS FROM SUPABASE:", formattedCustomers);

            setCustomers(formattedCustomers);

        } catch (err) {
            console.error("Fetch customers error:", err.message);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    // INITIAL FETCH + REALTIME
    useEffect(() => {
        let channel = null;
        let cancelled = false;

        const setupRealtime = async () => {
            await fetchCustomers();

            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user || cancelled) return;

            // Remove old channel
            const existingChannel = supabase
                .getChannels()
                .find(
                    (c) =>
                        c.topic ===
                        "realtime:customers-realtime"
                );

            if (existingChannel) {
                await supabase.removeChannel(
                    existingChannel
                );
            }

            // Create realtime channel
            channel = supabase.channel(
                "customers-realtime"
            );

            channel.on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "customers",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    console.log(
                        "Customer Realtime:",
                        payload
                    );

                    fetchCustomers();
                }
            );

            channel.subscribe((status) => {
                console.log(
                    "CUSTOMER REALTIME STATUS:",
                    status
                );
            });
        };

        setupRealtime();

        return () => {
            cancelled = true;

            if (channel) {
                supabase.removeChannel(channel);
                channel = null;
            }
        };
    }, []);

    // ADD CUSTOMER
    const addCustomer = async (customer) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("User not logged in");
        }

        const { data, error } = await supabase
            .from("customers")
            .insert([
                {
                    name: customer.name,
                    phone: customer.phone,
                    address: customer.address,
                    qty: Number(customer.qty || 0),
                    milk_rate: Number(customer.milkRate || 0),
                    user_id: user.id,
                },
            ])
            .select()
            .single();

        if (error) {
            console.error(
                "Add customer error:",
                error
            );

            throw error;
        }

        const newCustomer = {
            id: data.id,
            name: data.name,
            phone: data.phone,
            address: data.address,
            qty: Number(data.qty || 0),
            milkRate: Number(data.milk_rate || 0),
            extraItems: [],
        };

        setCustomers((prev) => [
            newCustomer,
            ...prev,
        ]);
    };

    // DELETE CUSTOMER
    const deleteCustomer = async (id) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("User not logged in");
        }

        const { error } = await supabase
            .from("customers")
            .delete()
            .eq("id", id)
            .eq("user_id", user.id);

        if (error) throw error;

        setCustomers((prev) =>
            prev.filter((c) => c.id !== id)
        );
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

export const useCustomers = () =>
    useContext(CustomerContext);