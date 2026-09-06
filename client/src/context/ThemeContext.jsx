import { createContext, useState, useEffect } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // Check local storage or system preference
    const [theme, setTheme] = useState(() => {
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) return savedTheme;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return "dark";
        }
        return "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;

        root.classList.remove("light", "dark");
        root.classList.add(theme);

        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default ThemeContext;
