import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function Signup() {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        email: "",
    });

    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // =========================
    // INPUT CHANGE
    // =========================
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // =========================
    // SEND OTP
    // =========================
    const handleSendOTP = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            setMessage("Please enter your name");
            return;
        }

        if (!formData.phone.trim()) {
            setMessage("Please enter your phone number");
            return;
        }

        if (!formData.email.trim()) {
            setMessage("Please enter your email");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const { error } = await supabase.auth.signInWithOtp({
                email: formData.email.trim(),
                options: {
                    shouldCreateUser: true,
                },
            });

            if (error) {
                console.error("SEND OTP ERROR:", error);
                throw error;
            }

            setMessage("OTP sent successfully!");
            setStep(2);

        } catch (error) {
            console.error(error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // VERIFY OTP
    // =========================
    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        if (!otp || otp.length !== 6) {
            setMessage("Please enter a valid 6-digit OTP");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const { data, error } = await supabase.auth.verifyOtp({
                email: formData.email.trim(),
                token: otp,
                type: "email",
            });

            if (error) {
                console.error("VERIFY OTP ERROR:", error);
                throw error;
            }

            console.log("Authenticated User:", data.user);

            // =========================
            // SAVE CUSTOMER
            // =========================
            const { error: customerError } = await supabase
                .from("customers")
                .insert({
                    user_id: data.user.id,
                    name: formData.name.trim(),
                    phone: formData.phone.trim(),
                    email: formData.email.trim(),
                });

            if (customerError) {
                console.error("CUSTOMER INSERT ERROR:", customerError);
                throw customerError;
            }

            setMessage("Signup successful!");

            console.log("Customer created successfully");

        } catch (error) {
            console.error(error);
            setMessage(error.message);
        } finally {
            setLoading(false);
        }
    };

    // =========================
    // BACK TO SIGNUP
    // =========================
    const handleBack = () => {
        setStep(1);
        setOtp("");
        setMessage("");
    };

    return (
        <div
            style={{
                width: "400px",
                margin: "50px auto",
                padding: "30px",
                border: "1px solid #ddd",
                borderRadius: "12px",
            }}
        >
            <h2>Signup</h2>

            {message && (
                <p
                    style={{
                        padding: "10px",
                        background: "#f3f4f6",
                        borderRadius: "6px",
                    }}
                >
                    {message}
                </p>
            )}

            {/* =========================
                STEP 1
            ========================= */}
            {step === 1 && (
                <form onSubmit={handleSendOTP}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "12px",
                        }}
                    />

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Enter phone number"
                        value={formData.phone}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "12px",
                        }}
                    />

                    <input
                        type="email"
                        name="email"
                        placeholder="Enter email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginBottom: "12px",
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Sending OTP..." : "Send OTP"}
                    </button>

                </form>
            )}

            {/* =========================
                STEP 2
            ========================= */}
            {step === 2 && (
                <form onSubmit={handleVerifyOTP}>

                    <p>
                        OTP sent to:
                        <br />
                        <strong>{formData.email}</strong>
                    </p>

                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Enter 6-digit OTP"
                        value={otp}
                        onChange={(e) => {
                            const value = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 6);

                            setOtp(value);
                        }}
                        maxLength={6}
                        style={{
                            width: "100%",
                            padding: "12px",
                            marginBottom: "12px",
                            fontSize: "20px",
                            letterSpacing: "5px",
                            textAlign: "center",
                        }}
                    />

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "12px",
                        }}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>

                    <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "10px",
                            marginTop: "10px",
                        }}
                    >
                        Change Email
                    </button>

                </form>
            )}
        </div>
    );
}