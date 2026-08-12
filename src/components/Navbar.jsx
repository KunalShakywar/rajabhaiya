import { NavLink } from "react-router-dom";
import {
    FiHome,
    FiList,
    FiUsers,
    FiBox,
    FiFileText,
} from "react-icons/fi";

export default function Navbar() {
    const navClass = ({ isActive }) =>
        `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isActive
            ? "border border-blue-600 bg-blue-400 text-white shadow"
            : "text-gray-700 hover:bg-gray-300"
        }`;

    const mobileClass = ({ isActive }) =>
        `flex flex-col items-center justify-center text-xs transition-colors ${isActive ? "text-blue-600" : "text-gray-500"
        }`;

    return (
        <>
            {/* Desktop / Tablet Top Navbar */}
            <nav className="hidden md:flex gap-3 p-4 bg-white/10 backdrop-blur-md  sticky top-0 z-40">
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
            </nav>

            {/* Mobile Bottom Navbar */}
            <nav
                className="fixed inset-x-0 bottom-4 z-9999 flex justify-center md:hidden pointer-events-none"
            >
                <div
                    className="pointer-events-auto w-[94%] max-w-md rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.12)] px-1 py-1"
                >
                    <div className="grid grid-cols-5 h-16">

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

                    </div>
                </div>
            </nav>
        </>
    );
}