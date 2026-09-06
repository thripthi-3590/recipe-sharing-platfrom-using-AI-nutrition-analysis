import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Save, Target } from 'lucide-react';
import { toast } from 'react-toastify';

const NutritionGoals = ({ currentGoals, onUpdate }) => {
    const [goals, setGoals] = useState({
        dailyCalories: 2000,
        dailyProtein: 150,
        dailyCarbs: 250,
        dailyFats: 70,
        dailyFiber: 30
    });

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentGoals) {
            setGoals(currentGoals);
        }
    }, [currentGoals]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setGoals(prev => ({
            ...prev,
            [name]: Number(value)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/nutrition/goals', goals);
            toast.success('Nutrition goals updated!');
            if (onUpdate) onUpdate(data.nutritionGoals);
        } catch (error) {
            toast.error('Failed to update goals');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-green-100 dark:bg-green-900 rounded-xl text-green-600 dark:text-green-400">
                    <Target size={24} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Daily Targets</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Calories</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="dailyCalories"
                                value={goals.dailyCalories}
                                onChange={handleChange}
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-xl focus:border-green-500 focus:ring-0 text-lg font-bold text-gray-900 dark:text-white transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">kcal</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Protein</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="dailyProtein"
                                value={goals.dailyProtein}
                                onChange={handleChange}
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-xl focus:border-blue-500 focus:ring-0 text-lg font-bold text-gray-900 dark:text-white transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">g</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Carbs</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="dailyCarbs"
                                value={goals.dailyCarbs}
                                onChange={handleChange}
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-xl focus:border-yellow-500 focus:ring-0 text-lg font-bold text-gray-900 dark:text-white transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">g</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Fats</label>
                        <div className="relative">
                            <input
                                type="number"
                                name="dailyFats"
                                value={goals.dailyFats}
                                onChange={handleChange}
                                className="w-full pl-4 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-100 dark:border-gray-600 rounded-xl focus:border-red-500 focus:ring-0 text-lg font-bold text-gray-900 dark:text-white transition-all"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">g</span>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-gray-900 dark:bg-primary text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-gray-800 dark:hover:bg-primary-dark transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                    ) : (
                        <>
                            <Save size={20} /> Save Targets
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default NutritionGoals;
