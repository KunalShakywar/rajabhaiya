import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function Layout() {
    return (
        <div className="min-h-screen bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
            <Navbar />
            <main className="p-4">
                <Outlet />
            </main>
        </div >
    );
}