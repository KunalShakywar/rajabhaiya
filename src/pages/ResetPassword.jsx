import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FiLock,
    FiEye,
    FiEyeOff,
    FiCheckCircle,
} from "react-icons/fi";
import { supabase } from "../lib/supabase";

export default function ResetPassword() {
    const navigate = useNavigate();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // =========================
    // UPDATE PASSWORD
    // =========================
    const handleUpdatePassword = async (e) => {
        e.preventDefault();

        setError("");
        setMessage("");

        // Password validation
        if (password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        // Confirm password validation
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        setLoading(false);

        if (error) {
            console.error("PASSWORD UPDATE ERROR:", error);

            setError(error.message);
            return;
        }

        setMessage("Password updated successfully.");

        // Redirect to login
        setTimeout(() => {
            navigate("/login", { replace: true });
        }, 1500);
    };

    return (
        <div
            className="relative min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
            style={{
                backgroundImage: `url(${window.innerWidth < 640
                    ? "https://picsum.photos/720/1280?blur=2"
                    : "https://picsum.photos/1920/1080?blur=2"
                    })`,
            }}
        >
            {/* =========================
                OVERLAY
            ========================= */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* =========================
                CARD
            ========================= */}
            <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white/30 backdrop-blur-xl border border-white/20 p-6 shadow-2xl">

                {/* =========================
                    HEADER
                ========================= */}
                <div className="flex flex-col items-center mb-6">
                    <h1 className="text-2xl font-bold text-white text-center">
                        Reset Password
                    </h1>

                    <p className="text-sm text-white/80 mt-1 text-center">
                        Create a new password for your account
                    </p>

                </div>

                {/* =========================
                    ERROR
                ========================= */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-100/80 border border-red-300 px-3 py-2">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {/* =========================
                    SUCCESS
                ========================= */}
                {message && (
                    <div className="mb-4 rounded-lg bg-green-100/80 border border-green-300 px-3 py-2">

                        <div className="flex items-center gap-2">

                            <FiCheckCircle
                                className="text-green-700"
                                size={18}
                            />

                            <p className="text-sm text-green-700">
                                {message}
                            </p>

                        </div>

                    </div>
                )}

                {/* =========================
                    FORM
                ========================= */}
                <form
                    onSubmit={handleUpdatePassword}
                    className="space-y-4"
                >

                    {/* NEW PASSWORD */}
                    <div className="relative">

                        <FiLock
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                        />

                        <input
                            type={
                                showPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="New password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError("");
                            }}
                            className="w-full rounded-xl border border-white/30 bg-white/70 pl-10 pr-11 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? (
                                <FiEyeOff size={18} />
                            ) : (
                                <FiEye size={18} />
                            )}
                        </button>

                    </div>

                    {/* CONFIRM PASSWORD */}
                    <div className="relative">

                        <FiLock
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                            size={18}
                        />

                        <input
                            type={
                                showConfirmPassword
                                    ? "text"
                                    : "password"
                            }
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => {
                                setConfirmPassword(
                                    e.target.value
                                );
                                setError("");
                            }}
                            className="w-full rounded-xl border border-white/30 bg-white/70 pl-10 pr-11 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(
                                    !showConfirmPassword
                                )
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? (
                                <FiEyeOff size={18} />
                            ) : (
                                <FiEye size={18} />
                            )}
                        </button>

                    </div>

                    {/* PASSWORD INFO */}
                    <p className="text-xs text-white/80">
                        Password must contain at least 6 characters.
                    </p>

                    {/* =========================
                        UPDATE BUTTON
                    ========================= */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white font-semibold shadow-md hover:bg-green-700 disabled:opacity-70 transition"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                                Updating...
                            </>
                        ) : (
                            <>
                                <FiCheckCircle size={18} />

                                Update Password
                            </>
                        )}
                    </button>

                </form>

            </div>
        </div>
    );
}