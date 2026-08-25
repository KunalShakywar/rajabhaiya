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

            setCustomers(formattedCustomers);

            console.log(
                "CUSTOMERS FROM SUPABASE:",
                formattedCustomers
            );
        } catch (err) {
            console.error("Fetch customers error:", err);
            setCustomers([]);
        } finally {
            setLoading(false);
        }
    };

    // AUTH + INITIAL FETCH + REALTIME
    useEffect(() => {
        let channel;

        const initialize = async () => {
            // First check current session
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (session?.user) {
                await fetchCustomers();

                // REALTIME
                channel = supabase
                    .channel("customers-realtime")
                    .on(
                        "postgres_changes",
                        {
                            event: "*",
                            schema: "public",
                            table: "customers",
                            filter: `user_id=eq.${session.user.id}`,
                        },
                        (payload) => {
                            console.log(
                                "Customer Realtime:",
                                payload
                            );

                            fetchCustomers();
                        }
                    )
                    .subscribe((status) => {
                        console.log(
                            "CUSTOMER REALTIME STATUS:",
                            status
                        );
                    });
            } else {
                setCustomers([]);
                setLoading(false);
            }
        };

        initialize();

        // AUTH STATE CHANGE
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                console.log(
                    "AUTH EVENT:",
                    event,
                    session?.user?.id
                );

                if (session?.user) {
                    await fetchCustomers();
                } else {
                    setCustomers([]);
                    setLoading(false);
                }
            }
        );

        return () => {
            subscription.unsubscribe();

            if (channel) {
                supabase.removeChannel(channel);
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
            console.error("Add customer error:", error);
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
    // UPDATE
    const updateCustomer = async (id, customer) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            throw new Error("User not logged in");
        }

        const { data, error } = await supabase
            .from("customers")
            .update({
                name: customer.name,
                phone: customer.phone,
                address: customer.address,
                qty: Number(customer.qty || 0),
                milk_rate: Number(customer.milkRate || 0),
            })
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) {
            console.error("Update customer error:", error);
            throw error;
        }

        const updatedCustomer = {
            id: data.id,
            name: data.name,
            phone: data.phone,
            address: data.address,
            qty: Number(data.qty || 0),
            milkRate: Number(data.milk_rate || 0),
            extraItems: [],
        };

        setCustomers((prev) =>
            prev.map((customer) =>
                customer.id === id ? updatedCustomer : customer
            )
        );
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
                updateCustomer,
                deleteCustomer,
            }}
        >
            {children}
        </CustomerContext.Provider>
    );
};

export const useCustomers = () =>
    useContext(CustomerContext);