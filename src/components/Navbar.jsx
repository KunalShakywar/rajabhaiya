import { NavLink, Link } from "react-router-dom";
import { useTheme } from "../pages/context/ThemeContext";
import { useState } from "react";
import {
    FiHome,
    FiList,
    FiUsers,
    FiBox,
    FiFileText,
    FiMoon,
    FiSun,
    FiUser,
    FiMenu,
} from "react-icons/fi";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();
    const [showMenu, setShowMenu] = useState(false);

    const navClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${isActive
            ? "bg-blue-600 text-white shadow"
            : "text-gray-700 hover:bg-gray-200 dark:text-gray-200 dark:hover:bg-zinc-800"
        }`;

    const mobileClass = ({ isActive }) =>
        `flex flex-col items-center justify-center text-xs transition ${isActive
            ? "text-blue-600 dark:text-blue-400"
            : "text-gray-500 dark:text-gray-400"
        }`;

    return (
        <>
            {/* Desktop */}
            <nav className="hidden md:flex gap-3 p-4 bg-white/10 dark:bg-gray-900/80 backdrop-blur-md  sticky top-0 z-40">

                <NavLink to="/" end className={navClass}>
                    <FiHome />
                    Dashboard
                </NavLink>

                <NavLink to="/regularentries" className={navClass}>
                    <FiList />
                    Regular Entries
                </NavLink>

                <NavLink to="/customer" className={navClass}>
                    <FiUsers />
                    Customers
                </NavLink>

                <NavLink to="/products" className={navClass}>
                    <FiBox />
                    Products
                </NavLink>

                <NavLink to="/billing" className={navClass}>
                    <FiFileText />
                    Billing
                </NavLink>

                <div className="ml-auto">
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <FiMenu size={22} />
                        </button>

                        {showMenu && (
                            <div className="absolute top-12 right-0 w-44 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-xl overflow-hidden z-50">

                                <NavLink
                                    to="/account"
                                    onClick={() => setShowMenu(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-4 py-3 text-sm ${isActive
                                            ? "bg-green-100 text-green-600 dark:bg-gray-700 dark:text-green-400"
                                            : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        }`
                                    }
                                >
                                    <FiUser />
                                    Profile
                                </NavLink>

                                <button
                                    onClick={() => {
                                        toggleTheme();
                                        setShowMenu(false);
                                    }}
                                    className="w-full cursor-pointer flex items-center gap-3 px-4 py-3 text-sm text-slate-200 dark:text-slate-200 hover:bg-gray-100 dark:hover:bg-gray-700 "
                                >
                                    {theme === "dark" ? <FiSun /> : <FiMoon />}
                                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
            {/* bg-white/10 dark:bg-gray-900/80 backdrop-blur-md */}
            {/* Mobile */}
            <nav className="fixed inset-x-0 bottom-4 z-50 flex justify-center md:hidden pointer-events-none">
                <div className="pointer-events-auto w-[94%] max-w-md rounded-2xl border bg-white/10 dark:bg-gray-900/80 border border-white dark:border-slate-700 backdrop-blur-md shadow-xl">
                    <div className="grid grid-cols-6 h-16">
                        <NavLink to="/" end className={mobileClass}>
                            <FiHome size={20} />
                            <span>Home</span>
                        </NavLink>

                        <NavLink to="/regularentries" className={mobileClass}>
                            <FiList size={20} />
                            <span>Entries</span>
                        </NavLink>

                        <NavLink to="/customer" className={mobileClass}>
                            <FiUsers size={20} />
                            <span>Customers</span>
                        </NavLink>

                        <NavLink to="/products" className={mobileClass}>
                            <FiBox size={20} />
                            <span>Products</span>
                        </NavLink>

                        <NavLink to="/billing" className={mobileClass}>
                            <FiFileText size={20} />
                            <span>Billing</span>
                        </NavLink>

                        <div className="relative flex items-center justify-center">
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300"
                            >
                                <FiMenu size={20} />
                                <span className="text-xs">More</span>
                            </button>

                            {showMenu && (
                                <div className="absolute bottom-16 right-0 w-40 rounded-xl bg-white dark:bg-gray-800 shadow-xl border border-gray-200 dark:border-slate-700 overflow-hidden mb-2">

                                    <NavLink
                                        to="/account"
                                        onClick={() => setShowMenu(false)}
                                        className={({ isActive }) =>
                                            `flex items-center gap-3 px-4 py-3 text-sm ${isActive
                                                ? "bg-green-100 text-green-600 dark:bg-gray-700 dark:text-green-400"
                                                : "hover:bg-gray-100 dark:hover:bg-gray-700"
                                            }`
                                        }
                                    >
                                        <FiUser />
                                        Profile
                                    </NavLink>

                                    <button
                                        onClick={() => {
                                            toggleTheme();
                                            setShowMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        {theme === "dark" ? <FiSun /> : <FiMoon />}
                                        {theme === "dark" ? "Light Mode" : "Dark Mode"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}