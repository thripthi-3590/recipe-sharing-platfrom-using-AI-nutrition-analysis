import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const AdminRoute = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={32} />
            </div>
        );
    }

    // Check if user is logged in AND is an admin
    if (!user || user.role !== 'admin') {
        // Redirect to home if logged in but not admin, or login if not logged in
        return <Navigate to={user ? "/" : "/login"} state={{ from: location }} replace />;
    }

    return children;
};

export default AdminRoute;
