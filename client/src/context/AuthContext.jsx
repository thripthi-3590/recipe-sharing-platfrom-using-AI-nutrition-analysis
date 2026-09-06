import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
        try {
            const token = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).token : null;
            if (!token) {
                setLoading(false);
                return;
            }

            // We need to set the token in headers if it's not set globally yet, 
            // but axios instance usually handles this if we set it. 
            // Ideally we should just rely on the interceptor or set it here.
            // For now assume the interceptor works or we pass it.
            // Actually, the api instance might not have the token if we just refreshed.
            // Let's rely on api.js interceptors if they exist, or manual header.

            const { data } = await api.get("/auth/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            // Merge token from localStorage with fresh data
            const storedUser = JSON.parse(localStorage.getItem("user"));
            const fullUser = { ...storedUser, ...data }; // data has favorites

            setUser(fullUser);
            localStorage.setItem("user", JSON.stringify(fullUser));
        } catch (error) {
            console.error("Failed to fetch user", error);
            // If auth check fails, maybe logout?
            // logout();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        checkUser();
    }, []);

    const login = async (email, password) => {
        const { data } = await api.post("/auth/login", { email, password });
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        // Fetch full profile to get favorites specifically if login response doesn't have it
        // But for now let's hope it works or we call checkUser() in background
        checkUser();
        return data;
    };

    const register = async (username, email, password) => {
        const { data } = await api.post("/auth/register", { username, email, password });
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        return data;
    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
    };

    const toggleFavorite = async (recipeId) => {
        try {
            const { data } = await api.put(`/users/favorites/${recipeId}`);

            // Backend now returns stringified IDs reliably
            const favorites = Array.isArray(data.favorites) ? data.favorites : [];

            setUser(prev => {
                const updatedUser = { ...prev, favorites };
                localStorage.setItem("user", JSON.stringify(updatedUser));
                return updatedUser;
            });

            return true;
        } catch (error) {
            console.error("Failed to toggle favorite", error);
            const errorMsg = error.response?.data?.message || "Connection error";
            alert(`Cookbook update failed: ${errorMsg}. Please try logging out and back in.`);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, toggleFavorite }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
