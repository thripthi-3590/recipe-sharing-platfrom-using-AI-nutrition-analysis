import { useContext } from "react";
import ThemeContext from "../context/ThemeContext";
import { Sun, Moon } from "lucide-react";

const ThemeToggle = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-all duration-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-yellow-500 dark:text-blue-400 shadow-sm"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
            {theme === 'light' ? (
                <Sun size={20} className="transform transition-transform hover:rotate-45" />
            ) : (
                <Moon size={20} className="transform transition-transform hover:-rotate-12" />
            )}
        </button>
    );
};

export default ThemeToggle;
