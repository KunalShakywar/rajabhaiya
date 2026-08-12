import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products
    const fetchProducts = async () => {
        const { data, error } = await supabase
            .from("products")
            .select("*")
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
        const { data, error } = await supabase
            .from("products")
            .insert([product])
            .select();

        if (error) throw error;

        setProducts((prev) => [...prev, data[0]]);
    };

    // Delete product
    const deleteProduct = async (id) => {
        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

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