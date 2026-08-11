import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiTrash, FiEdit, FiEye } from "react-icons/fi";
import ProductModal from "../components/ProductModal";
import DataTable from "../components/DataTable";
import { supabase } from "../lib/supabase";

const productColumns = [
    {
        header: "Product",
        accessor: "name",
    },
    {
        header: "Unit",
        accessor: "unit",
    },
    {
        header: "Rate",
        accessor: "rate",
        render: (row) => `₹${row.rate}/${row.unit}`,
    },
];

const Products = () => {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editProduct, setEditProduct] = useState(null);

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

    // Add or Update product
    const handleSave = async (product) => {
        const { data, error } = await supabase
            .from("products")
            .insert([
                {
                    name: product.name,
                    unit: product.unit,
                    rate: Number(product.rate),
                },
            ])
            .select();

        console.log("PRODUCT DATA =", data);
        console.log("PRODUCT ERROR =", error);

        if (error) {
            alert(error.message);
            return;
        }

        await fetchProducts();
        setIsModalOpen(false);
    };

    // Delete product
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this product?")) return;

        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", id);

        if (error) {
            console.error(error);
            return;
        }

        await fetchProducts();
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-sm lg:text-xl font-bold">Products</h1>

                <button
                    onClick={() => {
                        setEditProduct(null);
                        setIsModalOpen(true);
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium text-sm lg:text-xl"
                >
                    + Add Product
                </button>
            </div>

            <DataTable
                columns={productColumns}
                data={products}
                searchKeys={["name", "unit", "rate"]}
                rowsPerPage={5}
                actions={[
                    {
                        label: <FiEye />,
                        className: "bg-blue-500 hover:bg-blue-600 text-white cursor-pointer",
                        onClick: (row) => navigate(`/products/${row.id}`),
                    },
                    {
                        label: <FiEdit />,
                        className: "bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer",
                        onClick: (row) => {
                            setEditProduct(row);
                            setIsModalOpen(true);
                        },
                    },
                    {
                        label: <FiTrash />,
                        className: "bg-red-500 hover:bg-red-600 text-white cursor-pointer",
                        onClick: (row) => handleDelete(row.id),
                    },
                ]}
            />

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditProduct(null);
                }}
                onSave={handleSave}
                editData={editProduct}
            />
        </div>
    );
};

export default Products;