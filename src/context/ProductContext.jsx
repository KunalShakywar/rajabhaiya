import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // FETCH PRODUCTS
    const fetchProducts = async () => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("user_id", user.id)
            .order("id", { ascending: false });

        if (error) {
            console.error(error);
            return;
        }

        setProducts(data || []);
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Add product
    const addProduct = async (product) => {
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        console.log("AUTH USER:", user);

        if (authError || !user) {
            throw new Error("User not logged in");
        }

        const { data, error } = await supabase
            .from("products")
            .insert([
                {
                    name: product.name,
                    unit: product.unit,
                    rate: product.rate,
                    user_id: user.id, // REQUIRED FOR RLS
                },
            ])
            .select();

        console.log("PRODUCT DATA =", data);
        console.log("PRODUCT ERROR =", error);

        if (error) throw error;

        setProducts((prev) => [...prev, data[0]]);
    };

    // Delete product
    const deleteProduct = async (id) => {
        const {
            data: { user },
        } = await supabase.auth.getUser();

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id)


        if (error) throw error;

        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <ProductContext.Provider
            value={{
                products,
                loading,
                fetchProducts,
                addProduct,
                deleteProduct,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => useContext(ProductContext);