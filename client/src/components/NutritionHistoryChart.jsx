import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

const NutritionHistoryChart = ({ history }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-6">
                <TrendingUp className="text-purple-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Weekly Trends</h3>
            </div>
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={history}>
                        <defs>
                            <linearGradient id="colorCalories" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="displayDate"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#9CA3AF', fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#FFF', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="calories"
                            stroke="#f97316"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorCalories)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default NutritionHistoryChart;
