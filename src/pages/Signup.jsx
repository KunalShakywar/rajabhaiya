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

import { supabase } from "../lib/supabase";

export default function Signup() {
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
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);

    // =========================
    // HANDLE INPUT
    // =========================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // SEND OTP
    // =========================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!form.email) {
            setError("Email is required");
            return;
        }

        try {
            setLoading(true);

            console.log("Sending OTP to:", form.email);

            const { data, error } = await supabase.auth.signInWithOtp({
                email: form.email.trim(),
                options: {
                    shouldCreateUser: true,

                    data: {
                        ownerName: form.ownerName,
                        dairyName: form.dairyName,
                        phone: form.phone,
                        address: form.address,
                        gstNo: form.gstNo,
                        upiId: form.upiId,
                        role: form.role,
                    },
                },
            });

            console.log("OTP response:", data);

            if (error) {
                console.error("OTP ERROR:", error);
                throw error;
            }

            setStep(2);

        } catch (err) {
            console.error("SEND OTP ERROR:", err);
            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // VERIFY OTP
    // =========================

    const handleVerifyOTP = async () => {
        setError("");

        if (!otp) {
            setError("Please enter OTP");
            return;
        }

        if (otp.length !== 6) {
            setError("OTP must be 6 digits");
            return;
        }

        try {
            setLoading(true);

            console.log("Verifying OTP...");

            const { data, error } = await supabase.auth.verifyOtp({
                email: form.email.trim(),
                token: otp,
                type: "email",
            });

            if (error) {
                console.error("VERIFY ERROR:", error);
                throw error;
            }

            console.log("Authenticated user:", data.user);

            const user = data.user;

            // =========================
            // SAVE DAIRY PROFILE
            // =========================

            const { error: profileError } = await supabase
                .from("dairy_profile")
                .insert({
                    name: form.dairyName,
                    owner: form.ownerName,
                    phone: form.phone,
                    address: form.address,
                    email: form.email,
                    gst_no: form.gstNo || null,
                    upi_id: form.upiId || null,
                    user_id: user.id,
                    logo_url: null,
                });

            if (profileError) {
                console.error("PROFILE ERROR:", profileError);
                throw profileError;
            }

            alert("Dairy account created successfully!");

            navigate("/login");

        } catch (err) {
            console.error("VERIFY OTP ERROR:", err);
            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    // =========================
    // RESEND OTP
    // =========================

    const handleResendOTP = async () => {
        setError("");

        try {
            setLoading(true);

            const { error } = await supabase.auth.signInWithOtp({
                email: form.email.trim(),
                options: {
                    shouldCreateUser: true,
                },
            });

            if (error) {
                throw error;
            }

            alert("OTP sent again!");

        } catch (err) {
            console.error(err);
            setError(err.message);

        } finally {
            setLoading(false);
        }
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

            {/* Card */}
            <div className="relative z-10 w-full max-w-md rounded-3xl bg-white/30 backdrop-blur-xl border border-white/20 p-6 shadow-2xl">

                {/* =========================
                    STEP 1
                ========================= */}

                {step === 1 && (
                    <>
                        <div className="flex flex-col items-center mb-6">

                            <h1 className="text-2xl font-bold text-white text-center">
                                Create Your Dairy Account
                            </h1>

                            <p className="text-sm text-white/80 mt-2">
                                Enter your dairy details
                            </p>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-4 rounded-lg bg-red-100/80 border border-red-300 px-3 py-2">
                                <p className="text-sm text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                        >

                            {/* Owner */}
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                                <input
                                    type="text"
                                    name="ownerName"
                                    placeholder="Owner Name"
                                    value={form.ownerName}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 outline-none focus:border-green-500"
                                />
                            </div>

                            {/* Dairy */}
                            <div className="relative">
                                <FiHome className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                                <input
                                    type="text"
                                    name="dairyName"
                                    placeholder="Dairy Name"
                                    value={form.dairyName}
                                    onChange={handleChange}
                                    required
                                    className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 outline-none focus:border-green-500"
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
                                    required
                                    className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 outline-none focus:border-green-500"
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
                                    required
                                    className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 resize-none text-gray-800 outline-none focus:border-green-500"
                                />
                            </div>

                            {/* GST */}
                            <div className="relative">
                                <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                                <input
                                    type="text"
                                    name="gstNo"
                                    placeholder="GST Number (Optional)"
                                    value={form.gstNo}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 outline-none focus:border-green-500"
                                />
                            </div>

                            {/* UPI */}
                            <div className="relative">
                                <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                                <input
                                    type="text"
                                    name="upiId"
                                    placeholder="UPI ID (Optional)"
                                    value={form.upiId}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 outline-none focus:border-green-500"
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
                                    required
                                    className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 outline-none focus:border-green-500"
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
                                    required
                                    className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 outline-none focus:border-green-500"
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
                                    required
                                    className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-gray-800 outline-none focus:border-green-500"
                                />
                            </div>

                            {/* Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                            >
                                <FiUserPlus size={18} />

                                {loading
                                    ? "Sending OTP..."
                                    : "Create Account"}
                            </button>

                        </form>

                        <p className="text-center text-sm text-white/90 mt-5">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-green-200 hover:text-white hover:underline"
                            >
                                Login
                            </Link>
                        </p>
                    </>
                )}

                {/* =========================
                    STEP 2 - OTP
                ========================= */}

                {step === 2 && (
                    <>
                        <div className="flex flex-col items-center mb-6">

                            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mb-4">
                                <FiMail
                                    size={28}
                                    className="text-white"
                                />
                            </div>

                            <h1 className="text-2xl font-bold text-white text-center">
                                Verify Your Email
                            </h1>

                            <p className="text-sm text-white/80 text-center mt-2">
                                We sent a 6-digit OTP to
                            </p>

                            <p className="text-sm font-semibold text-white mt-1">
                                {form.email}
                            </p>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mb-4 rounded-lg bg-red-100/80 border border-red-300 px-3 py-2">
                                <p className="text-sm text-red-700">
                                    {error}
                                </p>
                            </div>
                        )}

                        <div className="space-y-4">

                            {/* OTP */}
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />

                                <input
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="Enter 6 digit OTP"
                                    value={otp}
                                    onChange={(e) => {
                                        const value = e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6);

                                        setOtp(value);
                                    }}
                                    className="w-full rounded-xl border border-gray-300 bg-white/70 pl-10 pr-4 py-3 text-center text-xl tracking-[8px] text-gray-800 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
                                />
                            </div>

                            {/* Verify */}
                            <button
                                type="button"
                                onClick={handleVerifyOTP}
                                disabled={loading}
                                className="w-full rounded-xl bg-green-600 py-3 text-white font-semibold hover:bg-green-700 disabled:opacity-50"
                            >
                                {loading
                                    ? "Verifying..."
                                    : "Verify OTP & Create Account"}
                            </button>

                            {/* Resend */}
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={loading}
                                className="w-full text-sm text-white underline hover:text-green-200"
                            >
                                Resend OTP
                            </button>

                            {/* Back */}
                            <button
                                type="button"
                                onClick={() => {
                                    setStep(1);
                                    setOtp("");
                                    setError("");
                                }}
                                disabled={loading}
                                className="w-full rounded-xl border border-white/30 py-3 text-white hover:bg-white/10"
                            >
                                Change Email
                            </button>

                        </div>
                    </>
                )}

            </div>
        </div>
    );
}