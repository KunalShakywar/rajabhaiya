import { useAuth } from "../context/AuthContext";
import {
    FiUser,
    FiMail,
    FiLogOut,
    FiHome,
    FiCalendar,
} from "react-icons/fi";


export default function Account() {
    const { user, logout } = useAuth();

    const ownerName =
        user?.user_metadata?.owner_name ||
        user?.email?.split("@")[0] ||
        "Dairy Owner";

    const dairyName =
        user?.user_metadata?.dairy_name || "Shri Ganesh Dairy";

    const createdDate = user?.created_at
        ? new Date(user.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : "-";

    return (
        <div className="min-h-screen  flex items-center justify-center">
            <div className="w-full max-w-md rounded-3xl bg-white shadow-xl border border-gray-100 overflow-hidden">

                {/* Top Banner */}
                <div className="bg-linear-to-br from-green-600 to-emerald-700 px-6 py-8 text-white text-center">


                    <h1 className="text-2xl font-bold">{ownerName}</h1>
                    <p className="text-green-100 mt-1">{dairyName}</p>
                </div>

                {/* Info Cards */}
                <div className="p-5 space-y-3">

                    {/* Email */}
                    <div className="flex items-center gap-3 rounded-2xl bg-gray-50 border p-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                            <FiMail size={18} />
                        </div>

                        <div className="min-w-0">
                            <p className="text-xs text-gray-500">Email</p>
                            <p className="font-medium text-gray-800 truncate">
                                {user?.email || "-"}
                            </p>
                        </div>
                    </div>

                    {/* Dairy + Joined */}
                    <div className="grid grid-cols-2 gap-3">

                        <div className="rounded-2xl bg-gray-50 border p-3">
                            <div className="flex items-center gap-2 text-green-600 mb-2">
                                <FiHome size={16} />
                                <span className="text-xs font-medium">Dairy</span>
                            </div>

                            <p className="text-sm font-semibold text-gray-800 leading-tight">
                                {dairyName}
                            </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 border p-3">
                            <div className="flex items-center gap-2 text-purple-600 mb-2">
                                <FiCalendar size={16} />
                                <span className="text-xs font-medium">Joined</span>
                            </div>

                            <p className="text-sm font-semibold text-gray-800">
                                {createdDate}
                            </p>
                        </div>
                    </div>


                    {/* Logout Button */}
                    <button
                        onClick={logout}
                        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-3 text-white font-semibold shadow-sm hover:bg-red-700 active:scale-[0.99] transition-all"
                    >
                        <FiLogOut size={18} />
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}