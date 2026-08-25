import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function SendOTP() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!email) {
            alert("Enter email");
            return;
        }

        try {
            setLoading(true);

            const { error } = await supabase.auth.signInWithOtp({
                email: email,
            });

            if (error) throw error;

            alert("OTP sent to your email");
            setStep(2);

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async () => {
        if (!otp) {
            alert("Enter OTP");
            return;
        }

        try {
            setLoading(true);

            const { data, error } =
                await supabase.auth.verifyOtp({
                    email: email,
                    token: otp,
                    type: "email",
                });

            if (error) throw error;

            console.log("User:", data.user);

            alert("Signup successful!");

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {step === 1 && (
                <>
                    <input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <button
                        onClick={handleSendOTP}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send OTP"}
                    </button>
                </>
            )}

            {step === 2 && (
                <>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />

                    <button
                        onClick={handleVerifyOTP}
                        disabled={loading}
                    >
                        {loading ? "Verifying..." : "Verify OTP"}
                    </button>
                </>
            )}
        </div>
    );
}