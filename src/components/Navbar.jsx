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
            ? "bg-blue-600 text-white shadow"
            : "text-gray-700 hover:bg-gray-300"
        }`;

    const mobileClass = ({ isActive }) =>
        `flex flex-col items-center justify-center text-xs transition-colors ${isActive ? "text-blue-600" : "text-gray-500"
        }`;

    return (
        <>
            {/* Desktop / Tablet Top Navbar */}
            <nav className="hidden md:flex gap-3 p-4 bg-gray-200 shadow-sm sticky top-0 z-40">
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
            <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg md:hidden">
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
            </nav>
        </>
    );
}