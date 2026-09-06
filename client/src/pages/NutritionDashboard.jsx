import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { Activity, ArrowRight } from 'lucide-react';

const NutritionDashboard = () => {
    const [progress, setProgress] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProgress = async () => {
        try {
            const [progressRes, historyRes] = await Promise.all([
                api.get('/nutrition/progress'),
                api.get('/nutrition/history')
            ]);
            setProgress(progressRes.data);
            setHistory(historyRes.data);
        } catch (error) {
            console.error("Failed to fetch nutrition data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgress();
    }, []);

    const handleGoalsUpdate = (newGoals) => {
        if (progress) {
            setProgress(prev => ({
                ...prev,
                goals: newGoals
            }));
        }
    };

    if (loading) return <div className="min-h-screen pt-24 text-center">Loading dashboard...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-green-500 rounded-2xl shadow-lg shadow-green-500/20 text-white">
                        <Activity size={32} />
                    </div>
                    <div>
                        <h1 className="text-4xl font-serif font-black text-gray-900 dark:text-white">Nutrition Tracker</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Monitor your daily intake and set healthy goals</p>
                    </div>
                </div>

                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="p-6 bg-green-100 dark:bg-green-900/20 rounded-full mb-8 animate-bounce-slow">
                        <Activity size={48} className="text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-3xl font-serif font-black text-gray-900 dark:text-white mb-4">Features Moved!</h2>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-10 text-lg">
                        We've consolidated all nutrition tracking features into the Meal Planner for a seamless experience.
                    </p>
                    <Link
                        to="/meal-planner"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-primary/30"
                    >
                        Go to Nutrition Planner <ArrowRight size={20} />
                    </Link>
                </div>


            </div>
        </div>
    );
};

export default NutritionDashboard;
