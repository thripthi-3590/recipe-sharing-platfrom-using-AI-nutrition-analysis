import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    Utensils,
    MessageSquare,
    LogOut,
    ChefHat,
    Home
} from 'lucide-react';

const AdminLayout = () => {
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/admin', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
        { path: '/admin/users', icon: <Users size={20} />, label: 'Users' },
        { path: '/admin/recipes', icon: <Utensils size={20} />, label: 'Recipes' },
        { path: '/admin/comments', icon: <MessageSquare size={20} />, label: 'Comments' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 fixed h-full z-10 transition-transform">
                <div className="h-20 flex items-center px-8 border-b border-gray-100">
                    <div className="flex items-center gap-2 text-primary font-bold text-xl font-serif">
                        <ChefHat size={24} />
                        <span>Admin Panel</span>
                    </div>
                </div>

                <nav className="p-4 space-y-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${isActive
                                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-primary'
                                    }`}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </Link>
                        );
                    })}

                    <div className="my-6 border-t border-gray-100 mx-4"></div>

                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-50 hover:text-primary transition-all duration-200 font-medium"
                    >
                        <Home size={20} />
                        <span>Client Home</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all duration-200 font-medium cursor-pointer"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="ml-64 flex-1 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
