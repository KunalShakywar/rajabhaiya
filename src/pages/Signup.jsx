import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiMail,
    FiLock,
    FiUser,
    FiHome,
    FiUserPlus,
    FiPhone,
    FiMapPin,
    FiCreditCard,
} from "react-icons/fi";
import { supabase } from "../lib/supabase"

import { useAuth } from "../context/AuthContext";

export default function Signup() {
    const { register } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        ownerName: "",
        dairyName: "",
        phone: "",
        address: "",
        gstNo: "",
        upiId: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "owner",
        user_id: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match");
        }

        setLoading(true);
        setError("");

        const { data, error } = await register(form.email, form.password);

        if (error) {
            setLoading(false);
            return setError(error.message);
        }
        if (!data.session) {
            return setError("Please verify your email before creating profile.");
        }
        const user = data.user;
        const { error: profileError } = await supabase
            .from("dairy_profile")
            .insert({
                name: form.dairyName,
                owner: form.ownerName,
                phone: form.phone,
                address: form.address,
                email: form.email,
                gst_no: form.gstNo,
                upi_id: form.upiId,
                user_id: user.id,
                logo_url: "",

            });

        setLoading(false);

        if (profileError) {
            return setError(profileError.message);
        }

        alert("Dairy account created successfully");
        navigate("/login");
    };

    return (
        <div
            className="relative  flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
            style={{
                backgroundImage: `url(${window.innerWidth < 640
                    ? "https://picsum.photos/720/1280?blur=2"
                    : "https://picsum.photos/1920/1080?blur=2"
                    })`,
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>

            {/* Signup Card */}
            <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/30 backdrop-blur-xl border border-white/20 p-6 shadow-2xl">

                {/* Logo */}
                <div className="flex flex-col items-center mb-6">

                    <h1 className="text-2xl font-bold text-white text-center">
                        Create Your Dairy Account
                    </h1>

                </div>

                {/* Error */}
                {error && (
                    <div className="mb-4 rounded-lg bg-red-100/80 border border-red-300 px-3 py-2">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Owner Name */}
                    <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            name="ownerName"
                            placeholder="Owner Name"
                            value={form.ownerName}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Dairy Name */}
                    <div className="relative">
                        <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            name="dairyName"
                            placeholder="Dairy Name"
                            value={form.dairyName}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="tel"
                            name="phone"
                            placeholder="Phone Number"
                            value={form.phone}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Address */}
                    <div className="relative">
                        <FiMapPin className="absolute left-3 top-4 text-gray-500" />
                        <textarea
                            name="address"
                            placeholder="Dairy Address"
                            value={form.address}
                            onChange={handleChange}
                            rows={3}
                            className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 resize-none text-gray-800 placeholder-gray-500 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* GST Number */}
                    <div className="relative">
                        <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            name="gstNo"
                            placeholder="GST Number (Optional)"
                            value={form.gstNo}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                    </div>

                    {/* UPI ID */}
                    <div className="relative">
                        <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="text"
                            name="upiId"
                            placeholder="UPI ID (Optional)"
                            value={form.upiId}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                        />
                    </div>

                    {/* Email */}
                    <div className="relative">
                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            value={form.confirmPassword}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 placeholder-gray-500 outline-none transition focus:border-green-500 focus:ring-1 focus:ring-green-500"
                            required
                        />
                    </div>

                    {/* Signup Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white font-semibold shadow-md transition-all duration-200 hover:bg-green-700 active:scale-95 disabled:opacity-50"
                    >
                        <FiUserPlus size={18} />
                        {loading ? "Creating Account..." : "Create Account"}
                    </button>

                </form>
                {/* Footer */}
                <p className="text-center text-sm text-white/90 mt-5">
                    Already have an account?{" "}
                    <Link
                        to="/login"
                        className="font-semibold text-green-200 hover:text-white hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}