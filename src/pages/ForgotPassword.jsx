import { useState } from "react";
import { FiMail, FiArrowLeft, FiSend } from "react-icons/fi";
import { supabase } from "../lib/supabase";

export default function ForgotPassword({ onBack }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        const { error } = await supabase.auth.resetPasswordForEmail(
            email.trim(),
            {
                redirectTo: `${window.location.origin}/reset-password`,
            }
        );

        setLoading(false);

        if (error) {
            console.error("RESET ERROR:", error);
            setError(error.message);
            return;
        }

        setMessage(
            "Password reset link has been sent to your email."
        );
    };

    return (
        <div className="w-full">

            {/* Description */}
            <p className="text-sm text-white/80 text-center mb-6">
                Enter your registered email and we'll send you
                a password reset link.
            </p>

            {/* Form */}
            <form
                onSubmit={handleResetPassword}
                className="space-y-4"
            >

                {/* Email */}
                <div className="relative">

                    <FiMail
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                        size={18}
                    />

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError("");
                            setMessage("");
                        }}
                        className="w-full rounded-xl border border-white/30 bg-white/70 pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                    />

                </div>

                {/* Error */}
                {error && (
                    <div className="rounded-lg bg-red-100/80 border border-red-300 px-3 py-2">
                        <p className="text-sm text-red-700">
                            {error}
                        </p>
                    </div>
                )}

                {/* Success */}
                {message && (
                    <div className="rounded-lg bg-green-100/80 border border-green-300 px-3 py-2">
                        <p className="text-sm text-green-700">
                            {message}
                        </p>
                    </div>
                )}

                {/* Send Reset Link */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white font-semibold shadow-md hover:bg-green-700 disabled:opacity-70 transition"
                >
                    {loading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                            Sending...
                        </>
                    ) : (
                        <>
                            <FiSend size={18} />

                            Send Reset Link
                        </>
                    )}
                </button>

            </form>

            {/* Back to Login */}
            <button
                type="button"
                onClick={onBack}
                className="w-full mt-4 flex items-center justify-center gap-2 text-white/90 text-sm font-medium hover:text-white transition"
            >
                <FiArrowLeft size={16} />

                Back to Login
            </button>

        </div>
    );
}