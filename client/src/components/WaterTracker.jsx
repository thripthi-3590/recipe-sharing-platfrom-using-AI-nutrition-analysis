import { useState, useEffect } from "react";
import { GlassWater, Plus, Minus } from "lucide-react";

const WaterTracker = () => {
    const [glasses, setGlasses] = useState(0);
    const goal = 8; // Daily goal of 8 glasses

    useEffect(() => {
        // Load from local storage for today
        const today = new Date().toISOString().split('T')[0];
        const saved = localStorage.getItem(`water_intake_${today}`);
        if (saved) {
            setGlasses(parseInt(saved, 10));
        }
    }, []);

    const updateGlasses = (newCount) => {
        if (newCount < 0) return;
        setGlasses(newCount);
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`water_intake_${today}`, newCount.toString());
    };

    const percentage = Math.min((glasses / goal) * 100, 100);

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <GlassWater className="text-blue-500" size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Hydration</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Daily Goal: {goal} glasses</p>
                </div>
            </div>

            <div className="flex items-center justify-between mb-4">
                <button
                    onClick={() => updateGlasses(glasses - 1)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
                >
                    <Minus size={20} />
                </button>
                <div className="text-center">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">{glasses}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/ {goal}</span>
                </div>
                <button
                    onClick={() => updateGlasses(glasses + 1)}
                    className="p-2 rounded-full bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-500 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className="h-full bg-blue-500 transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                />
            </div>

            {glasses >= goal && (
                <p className="text-center text-xs font-semibold text-green-500 mt-2">Daily goal reached! 🎉</p>
            )}
        </div>
    );
};

export default WaterTracker;
