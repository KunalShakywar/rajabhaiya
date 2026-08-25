import { useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useAuth } from "../../../context/AuthContext";

export default function ApprovalModal({ shop, onClose, refresh }) {
    const { user } = useAuth();

    const [days, setDays] = useState(30);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =========================
    // APPROVE SHOP
    // =========================
    const approve = async () => {
        if (!user) {
            setError("Admin user not found.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const start = new Date();

            const end = new Date();
            end.setDate(end.getDate() + Number(days));

            const { error } = await supabase
                .from("dairy_profile")
                .update({
                    status: "approved",
                    approved_at: start.toISOString(),
                    expires_at: end.toISOString(),
                    approved_by: user.id,
                })
                .eq("id", shop.id);

            if (error) {
                console.error("Approval error:", error);
                setError(error.message);
                return;
            }

            await refresh();
            onClose();

        } catch (err) {
            console.error("Approval error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // REJECT SHOP
    // =========================
    const reject = async () => {
        try {
            setLoading(true);
            setError("");

            const { error } = await supabase
                .from("dairy_profile")
                .update({
                    status: "rejected",
                    approved_at: null,
                    expires_at: null,
                    approved_by: null,
                })
                .eq("id", shop.id);

            if (error) {
                console.error("Reject error:", error);
                setError(error.message);
                return;
            }

            await refresh();
            onClose();

        } catch (err) {
            console.error("Reject error:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // PREVIEW EXPIRY DATE
    // =========================
    const expiryDate = new Date();

    expiryDate.setDate(
        expiryDate.getDate() + Number(days)
    );

    return (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

                {/* Header */}
                <div className="p-6 border-b">

                    <div className="flex items-start justify-between">

                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                Review Dairy Shop
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                                Review registration before approval
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            disabled={loading}
                            className="text-gray-400 hover:text-gray-700 text-xl"
                        >
                            ×
                        </button>

                    </div>

                </div>

                {/* Shop Information */}
                <div className="p-6 space-y-3">

                    <div>
                        <p className="text-xs text-gray-400">
                            Shop Name
                        </p>

                        <p className="font-semibold text-gray-900">
                            {shop.name || "N/A"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400">
                            Owner
                        </p>

                        <p className="font-medium text-gray-800">
                            {shop.owner || "N/A"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400">
                            Phone
                        </p>

                        <p className="text-gray-800">
                            {shop.phone || "N/A"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400">
                            Email
                        </p>

                        <p className="text-gray-800">
                            {shop.email || "N/A"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-400">
                            Address
                        </p>

                        <p className="text-gray-800">
                            {shop.address || "N/A"}
                        </p>
                    </div>

                    {shop.gst_no && (
                        <div>
                            <p className="text-xs text-gray-400">
                                GST Number
                            </p>

                            <p className="text-gray-800">
                                {shop.gst_no}
                            </p>
                        </div>
                    )}

                    {/* Duration */}
                    <div className="pt-4">

                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Approval Duration
                        </label>

                        <select
                            value={days}
                            onChange={(e) =>
                                setDays(Number(e.target.value))
                            }
                            disabled={loading}
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={30}>
                                30 Days
                            </option>

                            <option value={90}>
                                90 Days
                            </option>

                            <option value={180}>
                                180 Days
                            </option>

                            <option value={365}>
                                1 Year
                            </option>
                        </select>

                    </div>

                    {/* Expiry Preview */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">

                        <p className="text-sm text-blue-600">
                            Approval will expire on
                        </p>

                        <p className="font-semibold text-blue-900 mt-1">
                            {expiryDate.toLocaleDateString()}
                        </p>

                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3">

                            <p className="text-sm text-red-700">
                                {error}
                            </p>

                        </div>
                    )}

                </div>

                {/* Buttons */}
                <div className="p-6 pt-0 flex gap-3">

                    <button
                        onClick={reject}
                        disabled={loading}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Reject"}
                    </button>

                    <button
                        onClick={approve}
                        disabled={loading}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
                    >
                        {loading ? "Processing..." : "Approve"}
                    </button>

                </div>

            </div>

        </div>
    );
}