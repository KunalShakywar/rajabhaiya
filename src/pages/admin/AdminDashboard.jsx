import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ApprovalModal from "./components/ApprovalModal";

export default function AdminDashboard() {
    const [shops, setShops] = useState([]);
    const [selected, setSelected] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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

            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

            {/* =========================
                HEADER
            ========================= */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Admin Dashboard
                </h1>

                <p className="text-gray-500 mt-1">
                    Manage dairy shop registrations and approvals
                </p>
            </div>

            {/* =========================
                STATS
            ========================= */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                {/* Total */}
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                    <p className="text-sm text-gray-500">
                        Total Shops
                    </p>

                    <h2 className="text-3xl font-bold text-gray-900 mt-2">
                        {totalCount}
                    </h2>
                </div>

                {/* Pending */}
                <div className="bg-yellow-50 rounded-2xl p-5 shadow-sm border border-yellow-100">
                    <p className="text-sm text-yellow-700">
                        Pending
                    </p>

                    <h2 className="text-3xl font-bold text-yellow-700 mt-2">
                        {pendingCount}
                    </h2>
                </div>

                {/* Approved */}
                <div className="bg-green-50 rounded-2xl p-5 shadow-sm border border-green-100">
                    <p className="text-sm text-green-700">
                        Approved
                    </p>

                    <h2 className="text-3xl font-bold text-green-700 mt-2">
                        {approvedCount}
                    </h2>
                </div>

                {/* Rejected */}
                <div className="bg-red-50 rounded-2xl p-5 shadow-sm border border-red-100">
                    <p className="text-sm text-red-700">
                        Rejected
                    </p>

                    <h2 className="text-3xl font-bold text-red-700 mt-2">
                        {rejectedCount}
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
                <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
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
                <div className="bg-white rounded-2xl shadow-sm p-10 text-center">

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
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                    {/* Table Header */}
                    <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Dairy Applications
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Review and manage registered dairy shops
                            </p>
                        </div>

                        <button
                            onClick={fetchShops}
                            disabled={loading}
                            className="px-4 py-2 rounded-lg bg-gray-900 text-white text-sm hover:bg-gray-800 disabled:opacity-50"
                        >
                            Refresh
                        </button>

                    </div>

                    {/* Shop List */}
                    <div className="divide-y divide-gray-100">

                        {shops.map((shop) => (

                            <div
                                key={shop.id}
                                className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 hover:bg-gray-50 transition"
                            >

                                {/* Shop Information */}
                                <div className="min-w-0">

                                    <div className="flex items-center gap-3 flex-wrap">

                                        <h3 className="font-semibold text-lg text-gray-900">
                                            {shop.name || "Unnamed Dairy"}
                                        </h3>

                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusStyle(
                                                shop.status
                                            )}`}
                                        >
                                            {shop.status || "pending"}
                                        </span>

                                    </div>

                                    <div className="mt-2 space-y-1">

                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                Owner:
                                            </span>{" "}
                                            {shop.owner || "N/A"}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            <span className="font-medium">
                                                Phone:
                                            </span>{" "}
                                            {shop.phone || "N/A"}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            <span className="font-medium">
                                                Email:
                                            </span>{" "}
                                            {shop.email || "N/A"}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            <span className="font-medium">
                                                Address:
                                            </span>{" "}
                                            {shop.address || "N/A"}
                                        </p>

                                        {shop.gst_no && (
                                            <p className="text-gray-500 text-sm">
                                                <span className="font-medium">
                                                    GST:
                                                </span>{" "}
                                                {shop.gst_no}
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-400 mt-2">
                                            Registered:{" "}
                                            {shop.created_at
                                                ? new Date(
                                                    shop.created_at
                                                ).toLocaleString()
                                                : "N/A"}
                                        </p>

                                    </div>

                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-3 shrink-0">

                                    {/* Approved Expiry */}
                                    {shop.status === "approved" &&
                                        shop.expires_at && (
                                            <div className="text-right mr-2">
                                                <p className="text-xs text-gray-400">
                                                    Expires
                                                </p>

                                                <p className="text-sm font-medium text-gray-700">
                                                    {new Date(
                                                        shop.expires_at
                                                    ).toLocaleDateString()}
                                                </p>
                                            </div>
                                        )}

                                    {/* Review */}
                                    {shop.status === "pending" && (
                                        <button
                                            onClick={() =>
                                                setSelected(shop)
                                            }
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
                                        >
                                            Review
                                        </button>
                                    )}

                                    {/* Rejected */}
                                    {shop.status === "rejected" && (
                                        <button
                                            onClick={() =>
                                                setSelected(shop)
                                            }
                                            className="bg-gray-800 hover:bg-gray-900 text-white px-5 py-2.5 rounded-xl font-medium transition"
                                        >
                                            Review
                                        </button>
                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

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