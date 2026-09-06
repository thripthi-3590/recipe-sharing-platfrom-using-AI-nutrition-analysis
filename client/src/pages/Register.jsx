import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Register = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await register(username, email, password);
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-l from-primary to-accent"></div>

                <h2 className="text-3xl font-serif font-bold mb-2 text-center text-gray-900">Create Account</h2>
                <p className="text-center text-gray-500 mb-8">Join the community of culinary masters.</p>

                {error && <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-6 text-sm flex items-center justify-center font-medium border border-red-100">
                    {error}
                </div>}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Username</label>
                        <input
                            type="text"
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="ChefJohn"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button type="submit" className="w-full bg-gradient-to-r from-primary to-primary-dark text-white p-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5">
                        Start Cooking
                    </button>
                </form>
                <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-600">
                    Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
