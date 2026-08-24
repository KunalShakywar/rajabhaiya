import { useEffect, useState } from "react";
import {
    FiUsers,
    FiPackage,
    FiClipboard,
    FiDollarSign,
    FiTrendingUp,
    FiCreditCard,
    FiCamera,
    FiUser
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useProfile } from "../context/ProfileContext"

export default function Dashboard() {
    const navigate = useNavigate();
    const { profile, loading } = useProfile();

    const [stats, setStats] = useState({
        totalCustomers: 0,
        totalProducts: 0,
        todayEntries: 0,
        todayCollection: 0,
        topCustomer: "-",
        topCustomerAmount: 0,
    });

    const shortcuts = [
        {
            title: "Customers",
            icon: <FiUsers size={24} />,
            color: "bg-blue-500",
            path: "/customer",
        },
        {
            title: "QR Scan",
            icon: <FiCamera size={24} />,
            color: "bg-slate-500",
            path: "/entries",
        },
        {
            title: "Products",
            icon: <FiPackage size={24} />,
            color: "bg-green-500",
            path: "/products",
        },
        {
            title: "Entries",
            icon: <FiClipboard size={24} />,
            color: "bg-purple-500",
            path: "/regularentries",
        },
        {
            title: "Cards",
            icon: <FiCreditCard size={24} />,
            color: "bg-pink-500",
            path: "/customers",
        },
    ];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Customers
            const { data: customers } = await supabase
                .from("customers")
                .select("id, name");

            // Products
            const { data: products } = await supabase
                .from("products")
                .select("id");

            // Regular Entries
            const { data: entries, error: entriesError } = await supabase
                .from("regular_entries")
                .select(`
    customer_id,
    amount,
    entry_date,
    customers (
      name
    )
  `);

            if (entriesError) {
                console.error("Entries fetch error:", entriesError);
                return;
            }

            const today = new Date().toISOString().split("T")[0];

            const todayEntries = (entries || []).filter(
                (e) => e.entry_date === today
            );

            const todayCollection = todayEntries.reduce(
                (sum, e) => sum + Number(e.amount || 0),
                0
            );

            // Top customer analysis
            const customerTotals = {};
            (entries || []).forEach((e) => {
                const customerName = e.customers?.name || "Unknown";

                customerTotals[customerName] =
                    (customerTotals[customerName] || 0) + Number(e.amount || 0);
            });

            const topEntry = Object.entries(customerTotals).sort(
                (a, b) => b[1] - a[1]
            )[0];

            const topCustomer = topEntry?.[0] || "-";
            const topCustomerAmount = topEntry?.[1] || 0;

            setStats({
                totalCustomers: customers?.length || 0,
                totalProducts: products?.length || 0,
                todayEntries: todayEntries.length,
                todayCollection,
                topCustomer,
                topCustomerAmount,
            });
        } catch (err) {
            console.error("Dashboard error:", err);
        }
    };


    // Second horizontal line cards
    const secondStyle = "bg-white rounded-2xl p-4 sm:p-5 shadow-sm border  border-white dark:border-slate-700";
    return (
        <div className=" sm:p-4  lg:p-6 pb-20 overflow-y-auto">
            {/* Header */}
            <div className="mb-5">
                <h1 className="dark:text-white  text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">
                    {profile?.name || "Loading..."}
                </h1>

            </div>

            {/* Responsive Shortcut Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                {shortcuts.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => navigate(item.path)}
                        className="relative overflow-hidden rounded-2xl border border-gray-100 dark:border-slate-700 p-4 sm:p-5 flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95 transition-all dark:bg-gray-900"
                    >
                        {/* Blur Background */}
                        <div
                            className={`absolute w-24 h-24 ${item.color} opacity-20 blur-3xl rounded-full -top-4 -right-4`}
                        />

                        {/* Icon */}
                        <div
                            className={`relative z-10 ${item.color} w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-white shadow-md`}
                        >
                            {item.icon}
                        </div>

                        {/* Title */}
                        <span className="relative z-10 text-xs sm:text-sm font-medium text-gray-700 dark:text-white text-center">
                            {item.title}
                        </span>
                    </button>
                ))}
            </div>

            {/* Real Analysis Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-3">
                <div className={`${secondStyle} dark:bg-blue-900/10`}>
                    <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-white">Customers</p>
                        <FiUsers className="text-blue-500" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mt-2">
                        {stats.totalCustomers}
                    </h2>
                </div>

                <div className={`${secondStyle} dark:bg-green-900/10`}>
                    <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-white">Products</p>
                        <FiPackage className="text-green-500" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mt-2">
                        {stats.totalProducts}
                    </h2>
                </div>

                <div className={`${secondStyle} dark:bg-purple-900/10`}>
                    <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-white">Today Entries</p>
                        <FiClipboard className="text-purple-500" />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mt-2">
                        {stats.todayEntries}
                    </h2>
                </div>

                <div className={`${secondStyle} dark:bg-green-700/10`}>
                    <div className="flex items-center justify-between">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-white">Collection</p>
                        <span className="text-green-500 dark:text-green-400" >₹</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-green-600 mt-2">
                        ₹{stats.todayCollection}
                    </h2>
                </div>
            </div>

            {/* Customer Analysis */}
            <div className="mt-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className={`${secondStyle} dark:bg-gray-900`}>
                    <div className="flex items-center gap-2 mb-3">
                        <FiTrendingUp className="text-orange-500" />
                        <h3 className="font-semibold text-gray-800 dark:text-white">Top Customer</h3>
                    </div>
                    <div className="flex flex-row justify-between">

                        <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                            {stats.topCustomer}
                        </p>

                        <p className="text-sm text-green-600 dark:text-green-400 font-semibold mt-1">
                            ₹{stats.topCustomerAmount.toFixed(2)}
                        </p>
                    </div>
                </div>

                <div className={`${secondStyle} dark:bg-gray-900`}>
                    <div className="flex items-center gap-2 ">
                        <span className="text-green-500" >₹</span>
                        <h3 className="font-semibold text-gray-800 dark:text-white">Business Summary</h3>
                    </div>

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-white">Active Customers</span>
                            <span className="font-medium ">{stats.totalCustomers}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-white" >Available Products</span>
                            <span className="font-medium">{stats.totalProducts}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-white">Today Revenue</span>
                            <span className="font-medium text-green-600 dark:text-green-400">
                                ₹{stats.todayCollection}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}