import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, isAdmin }) {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    // Not logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Admin route
    if (isAdmin === true) {
        return children || <Outlet />;
    }

    // Normal logged-in user
    return children || <Outlet />;
}