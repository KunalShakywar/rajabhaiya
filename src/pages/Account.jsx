import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
    FiMail,
    FiPhone,
    FiMapPin,
    FiCalendar,
    FiLogOut,
    FiCreditCard,
    FiDollarSign,
    FiHome,


} from "react-icons/fi";
import { TbCurrencyRupee } from "react-icons/tb";

export default function Account() {
    const { user, logout } = useAuth();
    const [loggingOut, setLoggingOut] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    // hide and show
    const [showDairy, setShowDairy] = useState(false);
    const [showAccount, setShowAccount] = useState(false);

    useEffect(() => {
        if (user) loadProfile();
    }, [user]);

    async function loadProfile() {
        const { data, error } = await supabase
            .from("dairy_profile")
            .select("*")
            .eq("user_id", user.id)
            .maybeSingle();

        console.log("USER ID:", user.id);
        console.log("PROFILE:", data);
        console.log("ERROR:", error);

        setProfile(data);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                Loading...
            </div>
        );
    }
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        try {
            await logout();
        } catch (err) {
            console.error(err);
        } finally {
            setLoggingOut(false);
        }
        if (error) {
            console.error(error);
            return;
        }

        // optional: redirect
        window.location.href = "/login";
    };
    const joined = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : "-";
    const rupee = "₹"
    return (
        <div className="min-h-screen bg-slate-100 dark:bg-gray-900 py-6 px-4">
            <div className=" mx-auto grid lg:grid-cols-3 gap-2">

                {/* LEFT PROFILE CARD */}
                <div className="lg:sticky lg:top-6 h-fit">
                    <div className=" border border-slate-200 dark:border-slate-700 bg-white dark:bg-gray-900 p-4 rounded-xl dark:text-white shadow-xl">

                        <div className="w-28 h-28 mx-auto rounded-full bg-white/20 border border-slate-200 flex items-center justify-center text-5xl font-bold">
                            {profile?.owner?.charAt(0) || "D"}
                        </div>

                        <h2 className="text-2xl font-bold text-center mt-4">
                            {profile?.owner}
                        </h2>

                        <p className="flex items-center justify-center gap-2 text-green dark:text-green-100  mt-2">
                            <FiHome />
                            {profile?.name}
                        </p>

                        <div className="border-t border-slate-200 dark:border-slate-700 my-6" />

                        <div className="space-y-4 text-sm">
                            <div className="flex items-center gap-3">
                                <FiMail className="dark:text-green-200 " />
                                <span>{profile?.email || user?.email}</span>
                            </div>

                            <div className="flex items-center gap-3">
                                <FiPhone className="dark:text-green-200" />
                                <span>{profile?.phone}</span>
                            </div>

                            <div className="flex items-start gap-3">
                                <FiMapPin className="dark:text-green-200 mt-1" />
                                <span>{profile?.address}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            disabled={loggingOut}
                            className="w-full mt-8 bg-red-600 hover:bg-red-700 disabled:opacity-70 text-white rounded-xl py-3 font-semibold flex items-center justify-center gap-2"
                        >
                            {loggingOut ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Logging out...
                                </>
                            ) : (
                                <>
                                    <FiLogOut />
                                    Logout
                                </>
                            )}
                        </button>
                    </div>
                    <div>
                        <span>
                            <Link to="/dairy">Home</Link>
                        </span>
                    </div>
                </div>

                {/* 2nd SLIDE AND RIGHT DETAILS */}
                <div className="lg:col-span-2 space-y-5">

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow">
                        {/* Header */}
                        <button
                            onClick={() => setShowDairy(!showDairy)}
                            className="w-full flex items-center justify-between p-5 lg:cursor-default"
                        >
                            <h3 className="text-lg font-bold dark:text-white">
                                Dairy Information
                            </h3>

                            <span className="lg:hidden text-xl dark:text-white">
                                {showDairy ? "−" : "+"}
                            </span>
                        </button>

                        {/* Content */}
                        <div className={`${showDairy ? "block" : "hidden"} lg:block px-5 pb-5`}>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Info
                                    icon={<FiCreditCard />}
                                    title="GST Number"
                                    value={profile?.gst_no}
                                    color="blue"
                                />

                                <Info
                                    icon={<TbCurrencyRupee />}
                                    title="UPI ID"
                                    value={profile?.upi_id}
                                    color="green"
                                />

                                <Info
                                    icon={<FiCalendar />}
                                    title="Joined"
                                    value={joined}
                                    color="orange"
                                />

                                <Info
                                    icon={<FiHome />}
                                    title="Dairy Name"
                                    value={profile?.name}
                                    color="blue"
                                />
                            </div>
                        </div>
                    </div>
                    {/* Second */}

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow">
                        <button
                            onClick={() => setShowAccount(!showAccount)}
                            className="w-full flex items-center justify-between p-5 lg:cursor-default"
                        >
                            <h3 className="text-lg font-bold dark:text-white">
                                Account Details
                            </h3>

                            <span className="lg:hidden text-xl dark:text-white">
                                {showAccount ? "−" : "+"}
                            </span>
                        </button>

                        <div className={`${showAccount ? "block" : "hidden"} lg:block px-5 pb-5`}>
                            <div className="space-y-3">
                                <Info
                                    icon={<FiMail />}
                                    title="Email Address"
                                    value={profile?.email || user?.email}
                                    color="blue"
                                />

                                <Info
                                    icon={<FiPhone />}
                                    title="Mobile Number"
                                    value={profile?.phone}
                                    color="green"
                                />

                                <Info
                                    icon={<FiMapPin />}
                                    title="Business Address"
                                    value={profile?.address}
                                    color="orange"
                                />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function Info({ icon, title, value, color }) {
    const bg = {
        blue: "bg-blue-100 text-blue-600",
        green: "bg-green-100 text-green-600",
        orange: "bg-orange-100 text-orange-600",
    };

    return (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${bg[color]}`}>
                {icon}
            </div>
            <div>
                <p className="text-xs text-gray-500 dark:text-white">{title}</p>
                <p className="font-semibold dark:text-white">{value || "-"}</p>
            </div>
        </div>
    );
}

function Small({ icon, title, value, full }) {
    return (
        <div className={`bg-gray-50 dark:bg-gray-700 rounded-xl p-3 ${full ? "w-full" : ""}`}>
            <div className="flex items-center gap-2 text-gray-500 mb-1">
                {icon}
                <span className="text-xs dark:text-white">{title}</span>
            </div>
            <p className="font-semibold break-all dark:text-white">{value || "-"}</p>
        </div>
    );
}