import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiLogIn } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        const { error } = await login(email, password);

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        navigate("/", { replace: true });
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
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white/30 backdrop-blur-xl border border-white/20 p-6 shadow-2xl">

                {/* Logo */}
                <div className="flex flex-col items-center mb-6">

                    <h1 className="text-2xl font-bold text-white text-center">
                        Welcome Back
                    </h1>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-100/80 border border-red-300 px-3 py-2">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email */}
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-white/30 bg-white/70 pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-white/30 bg-white/70 pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white font-semibold shadow-md hover:bg-green-700 disabled:opacity-70"
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Logging in...
                            </>
                        ) : (
                            <>
                                <FiLogIn size={18} />
                                Login
                            </>
                        )}
                    </button>
                </form>

                {/* Footer */}
                <p className="text-center text-sm text-white/90 mt-5">
                    Don't have an account?{" "}
                    <Link
                        to="/signup"
                        className="font-semibold text-green-200 hover:text-white hover:underline"
                    >
                        Create Account
                    </Link>
                </p>
            </div>
        </div>
    );
}