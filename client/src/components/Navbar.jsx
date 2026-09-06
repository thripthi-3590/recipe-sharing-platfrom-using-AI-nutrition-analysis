import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle"; // Added
import { LogOut, ChefHat, PlusCircle, User as UserIcon, Heart, ShieldCheck, Zap, LayoutDashboard, Users, Utensils, MessageSquare, Folder } from "lucide-react";

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="fixed w-full top-0 z-50 glass transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
                        <div className="flex-shrink-0 flex items-center gap-3">
                            <div className="bg-gradient-to-br from-primary to-primary-dark p-2.5 rounded-xl shadow-lg shadow-primary/30 transform transition-transform hover:rotate-12">
                                <ChefHat className="h-7 w-7 text-white" />
                            </div>
                            <span className="font-serif font-bold text-2xl text-gray-900 tracking-tight">AI Chef</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {user ? (
                            <>
                                {user.role === 'admin' ? (
                                    <>
                                        <Link to="/admin" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                                            <LayoutDashboard size={18} />
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link to="/create-recipe" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                                            <PlusCircle size={18} />
                                            <span>Create</span>
                                        </Link>
                                        <Link to="/admin/users" className="hidden md:flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                                            <Users size={18} />
                                            <span>Users</span>
                                        </Link>
                                        <Link to="/admin/recipes" className="hidden md:flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                                            <Utensils size={18} />
                                            <span>Recipes</span>
                                        </Link>
                                        <Link to="/admin/comments" className="hidden md:flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 transition-colors">
                                            <MessageSquare size={18} />
                                            <span>Comments</span>
                                        </Link>
                                    </>
                                ) : user.role === 'chef' ? (
                                    <>
                                        <Link to="/create-recipe" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-primary/80 hover:text-primary transition-colors">
                                            <PlusCircle size={18} />
                                            <span>Create Recipe</span>
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        <Link to="/ai-generate" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-primary/80 hover:text-primary transition-colors">
                                            <ChefHat size={18} />
                                            <span>AI Generator</span>
                                        </Link>
                                        <Link to="/meal-planner" className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                                            <ShieldCheck size={18} />
                                            <span>Planner</span>
                                        </Link>
                                        <Link to="/feed" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                                            <Zap size={18} />
                                            <span>Feed</span>
                                        </Link>
                                        <Link to="/shopping-list" className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors">
                                            <PlusCircle size={18} />
                                            <span>List</span>
                                        </Link>
                                        <Link to="/saved-recipes" className="hidden md:flex items-center gap-2 text-sm font-semibold text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" title="Saved Recipes">
                                            <Heart size={18} />
                                            <span>Cookbook</span>
                                        </Link>
                                    </>
                                )}
                                <div className="h-6 w-[1px] bg-gray-200 dark:bg-gray-700 hidden md:block"></div>
                                <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-end hidden sm:flex">
                                        <span className="text-sm font-bold text-gray-800 dark:text-white leading-none">{user.username}</span>
                                        <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">
                                            {user.role === 'admin' ? 'Admin' : user.role === 'chef' ? 'Chef' : 'User'}
                                        </span>
                                    </div>
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 border-2 border-white dark:border-gray-500 shadow-sm flex items-center justify-center overflow-hidden">
                                        <UserIcon size={20} className="text-gray-400 dark:text-gray-300" />
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500 transition-all duration-200"
                                        title="Logout"
                                    >
                                        <LogOut size={20} />
                                    </button>
                                    <ThemeToggle /> {/* Added */}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <ThemeToggle /> {/* Added */}
                                <Link to="/login" className="text-sm font-semibold text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors">Sign In</Link>
                                <Link to="/register" className="px-5 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 rounded-full transition-all duration-300 transform hover:-translate-y-0.5">
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
