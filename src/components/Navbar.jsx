import { NavLink } from "react-router-dom";
import { useTheme } from "../pages/context/ThemeContext";
import {
    FiHome,
    FiList,
    FiUsers,
    FiBox,
    FiFileText,
    FiMoon,
    FiSun,
} from "react-icons/fi";

export default function Navbar() {
    const { theme, toggleTheme } = useTheme();

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
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg cursor-pointer  hover:bg-gray-100 dark:hover:bg-zinc-700 dark:text-white"
                    >
                        {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
                    </button>
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

                        <button
                            onClick={toggleTheme}
                            className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-300"
                        >
                            {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
                            <span className="text-xs">Theme</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}