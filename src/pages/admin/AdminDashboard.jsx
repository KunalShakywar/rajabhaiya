import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ApprovalModal from "./components/ApprovalModal";
import { useTheme } from "../context/ThemeContext";
import DataTable from "../../components/DataTable";
import { FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
    const [shops, setShops] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate("/login", { replace: true });
    };
    // Table
    const columns = [
        {
            header: "Dairy Shop",
            accessor: "name",
            render: (row) => (
                <div>
                    <p className="font-semibold">{row.name || "Unnamed Dairy"}</p>
                    <p className="text-xs text-gray-500">{row.owner}</p>
                </div>
            ),
        },
        {
            header: "Phone",
            accessor: "phone",
        },
        {
            header: "Email",
            accessor: "email",
        },
        {
            header: "Status",
            accessor: "status",
            render: (row) => (
                <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                        row.status
                    )}`}
                >
                    {row.status}
                </span>
            ),
        },
        {
            header: "Registered",
            accessor: "created_at",
            render: (row) =>
                row.created_at
                    ? new Date(row.created_at).toLocaleDateString()
                    : "N/A",
        },
        {
            header: "Expiry",
            accessor: "expires_at",
            render: (row) =>
                row.expires_at
                    ? new Date(row.expires_at).toLocaleDateString()
                    : "Not Set",
        },
    ];
    const actions = [
        {
            label: "Change",
            className: "bg-indigo-600 hover:bg-indigo-700",
            onClick: (row) => setSelected(row),
        },
    ];
    // =========================
    // FETCH DAIRY SHOPS
    // =========================
    const fetchShops = async () => {
        try {
            setLoading(true);
            setError("");

            const { data, error } = await supabase
                .from("dairy_profile")
                .select("*")
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Admin fetch error:", error);
                setError(error.message);
                setShops([]);
                return;
            }

            console.log("Dairy Shops:", data);

            setShops(data || []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.message);
            setShops([]);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // INITIAL LOAD
    // =========================
    useEffect(() => {
        fetchShops();
    }, []);

    // =========================
    // COUNTS
    // =========================
    const totalCount = shops.length;

    const pendingCount = shops.filter(
        (shop) => shop.status === "pending"
    ).length;

    const approvedCount = shops.filter(
        (shop) => shop.status === "approved"
    ).length;

    const rejectedCount = shops.filter(
        (shop) => shop.status === "rejected"
    ).length;
    const suspendCount = shops.filter(
        (shop) => shop.status === "suspended"
    ).length;

    // =========================
    // STATUS STYLE
    // =========================
    const getStatusStyle = (status) => {
        switch (status) {
            case "pending":
                return "bg-yellow-100 text-yellow-700";
            case "approved":
                return "bg-green-100 text-green-700";
            case "rejected":
                return "bg-red-100 text-red-700";
            case "suspended":
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">

            {/* =========================
                HEADER
            ========================= */}
            <div className="mb-6 flex justify-between">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                    Admin Dashboard
                </h1>
                <div className="flex">

                    <button
                        onClick={handleLogout}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-red-500 bg-red-100 hover:bg-red-200 transition"
                    >
                        <FiLogOut size={18} />
                    </button>
                    <button
                        onClick={() => {
                            toggleTheme();
                            setShowMenu(false);
                        }}
                        className="w-10 h-10 flex items-center justify-center dark:text-white hover:bg-white/10 rounded-full cursor-pointer transition"
                    >
                        {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
                    </button>
                </div>
            </div>

            {/* =========================
                STATS
            ========================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">


                {/* Total */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Shops</p>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                        {totalCount}
                    </h2>
                </div>

                {/* Pending */}
                <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-5 shadow-sm border border-yellow-200 dark:border-yellow-800">
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">Pending</p>
                    <h2 className="text-3xl font-bold text-yellow-700 dark:text-yellow-300 mt-2">
                        {pendingCount}
                    </h2>
                </div>

                {/* Approved */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 shadow-sm border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-300">Approved</p>
                    <h2 className="text-3xl font-bold text-green-700 dark:text-green-300 mt-2">
                        {approvedCount}
                    </h2>
                </div>

                {/* Rejected */}
                <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-5 shadow-sm border border-red-200 dark:border-red-800">
                    <p className="text-sm text-red-700 dark:text-red-300">Rejected</p>
                    <h2 className="text-3xl font-bold text-red-700 dark:text-red-300 mt-2">
                        {rejectedCount}
                    </h2>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-5 shadow-sm border border-orange-200 dark:border-orange-800">
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                        Suspended
                    </p>

                    <h2 className="text-3xl font-bold text-orange-700 dark:text-orange-300 mt-2">
                        {suspendCount}
                    </h2>
                </div>
            </div>

            {/* =========================
                ERROR
            ========================= */}
            {error && (
                <div className="mb-5 bg-red-100 border border-red-200 text-red-700 rounded-xl p-4">
                    <p className="font-semibold">
                        Error loading dairy shops
                    </p>

                    <p className="text-sm mt-1">
                        {error}
                    </p>
                </div>
            )}

            {/* =========================
                LOADING
            ========================= */}
            {loading && (
                <div className=" rounded-2xl shadow-sm p-10 text-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
                    </div>

                    <p className="text-gray-500">
                        Loading dairy shops...
                    </p>
                </div>
            )}

            {/* =========================
                EMPTY
            ========================= */}
            {!loading && !error && shops.length === 0 && (
                <div className="rounded-2xl shadow-sm p-10 text-center">

                    <h2 className="text-xl font-semibold text-gray-900">
                        No dairy shops found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        New dairy registrations will appear here.
                    </p>

                </div>
            )}

            {/* =========================
                DAIRY SHOPS
            ========================= */}
            {!loading && shops.length > 0 && (
                <div className=" rounded-2xl shadow-sm overflow-hidden">
                    <button
                        onClick={fetchShops}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-gray-900 dark:bg-gray-400/10 cursor-pointer text-white text-sm hover:bg-gray-800 disabled:opacity-50 mb-4"
                    >
                        Refresh
                    </button>
                    <DataTable
                        columns={columns}
                        data={shops}
                        actions={actions}
                        searchKeys={["name", "owner", "phone", "email"]}
                        rowsPerPage={5}
                    />
                </div>
            )}
            {/* =========================
                APPROVAL MODAL
            ========================= */}
            {selected && (
                <ApprovalModal
                    shop={selected}
                    onClose={() => setSelected(null)}
                    refresh={fetchShops}
                />
            )}

        </div>
    );
}