import { useState, useEffect } from 'react';
import api from '../api/axios';
import { Trophy, Flame, ChefHat, Utensils } from 'lucide-react';

const CookingStatsCard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/cooking-history/stats');
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch cooking stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="animate-pulse h-64 bg-gray-200 dark:bg-gray-700 rounded-3xl"></div>;
    if (!stats) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-serif flex items-center gap-2">
                <Trophy className="text-yellow-500" /> Chef Stats
            </h3>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-800">
                    <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400 mb-1">
                        <Flame size={18} />
                        <span className="text-xs font-black uppercase tracking-wider">Streak</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.currentStreak} <span className="text-sm font-bold text-gray-400">days</span></p>
                </div>

                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
                        <ChefHat size={18} />
                        <span className="text-xs font-black uppercase tracking-wider">Cooked</span>
                    </div>
                    <p className="text-3xl font-black text-gray-900 dark:text-white">{stats.totalCooked} <span className="text-sm font-bold text-gray-400">dishes</span></p>
                </div>

                <div className="col-span-2 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                        <Utensils size={18} />
                        <span className="text-xs font-black uppercase tracking-wider">Top Cuisine</span>
                    </div>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.favoriteCategory || 'None yet'}</p>
                </div>
            </div>
        </div>
    );
};

export default CookingStatsCard;
