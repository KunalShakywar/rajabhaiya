import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import ApprovalModal from "./components/ApprovalModal";

export default function PendingUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchPendingUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const { data, error } = await supabase
                .from("dairy_profile")
                .select("*")
                .eq("status", "pending")
                .order("created_at", {
                    ascending: false,
                });

            if (error) {
                console.error("Pending users error:", error);
                setError(error.message);
                return;
            }

            setUsers(data || []);
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Pending Users
                </h1>

                <p className="text-gray-500 mt-1">
                    Review dairy shop registration requests
                </p>
            </div>

            {/* Error */}
            {error && (
                <div className="mb-5 p-4 rounded-xl bg-red-100 text-red-700">
                    {error}
                </div>
            )}

            {/* Loading */}
            {loading && (
                <div className="bg-white rounded-2xl p-10 text-center">
                    <div className="w-8 h-8 mx-auto border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />

                    <p className="text-gray-500 mt-4">
                        Loading pending users...
                    </p>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && users.length === 0 && (
                <div className="bg-white rounded-2xl p-10 text-center shadow-sm">

                    <h2 className="text-xl font-semibold text-gray-900">
                        No Pending Users
                    </h2>

                    <p className="text-gray-500 mt-2">
                        There are no dairy shop applications waiting for approval.
                    </p>

                </div>
            )}

            {/* Users */}
            {!loading && users.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                    <div className="p-5 border-b">
                        <div className="flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold">
                                    Pending Applications
                                </h2>

                                <p className="text-sm text-gray-500 mt-1">
                                    {users.length} application
                                    {users.length !== 1 ? "s" : ""}
                                </p>
                            </div>

                            <button
                                onClick={fetchPendingUsers}
                                className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                            >
                                Refresh
                            </button>

                        </div>
                    </div>

                    <div className="divide-y">

                        {users.map((user) => (
                            <div
                                key={user.id}
                                className="p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 hover:bg-gray-50"
                            >

                                {/* User Information */}
                                <div>

                                    <div className="flex items-center gap-3">
                                        <h3 className="text-lg font-semibold text-gray-900">
                                            {user.name || "Unnamed Dairy"}
                                        </h3>

                                        <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
                                            Pending
                                        </span>
                                    </div>

                                    <div className="mt-2 space-y-1">

                                        <p className="text-gray-600">
                                            <span className="font-medium">
                                                Owner:
                                            </span>{" "}
                                            {user.owner || "N/A"}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            <span className="font-medium">
                                                Phone:
                                            </span>{" "}
                                            {user.phone || "N/A"}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            <span className="font-medium">
                                                Email:
                                            </span>{" "}
                                            {user.email || "N/A"}
                                        </p>

                                        <p className="text-gray-500 text-sm">
                                            <span className="font-medium">
                                                Address:
                                            </span>{" "}
                                            {user.address || "N/A"}
                                        </p>

                                        {user.gst_no && (
                                            <p className="text-gray-500 text-sm">
                                                <span className="font-medium">
                                                    GST:
                                                </span>{" "}
                                                {user.gst_no}
                                            </p>
                                        )}

                                        <p className="text-xs text-gray-400 mt-2">
                                            Applied:{" "}
                                            {new Date(
                                                user.created_at
                                            ).toLocaleString()}
                                        </p>

                                    </div>

                                </div>

                                {/* Review Button */}
                                <button
                                    onClick={() =>
                                        setSelectedUser(user)
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold"
                                >
                                    Review
                                </button>

                            </div>
                        ))}

                    </div>

                </div>
            )}

            {/* Approval Modal */}
            {selectedUser && (
                <ApprovalModal
                    shop={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    refresh={fetchPendingUsers}
                />
            )}

        </div>
    );
}