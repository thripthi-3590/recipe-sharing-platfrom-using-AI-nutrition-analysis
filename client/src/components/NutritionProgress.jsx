import { TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const ProgressBar = ({ label, current, target, color, unit = 'g' }) => {
    const percentage = Math.min(Math.round((current / target) * 100), 100);
    const isOver = current > target;

    // Choose color classes based on the prop
    const colorClasses = {
        green: 'bg-green-500 text-green-600',
        blue: 'bg-blue-500 text-blue-600',
        yellow: 'bg-yellow-500 text-yellow-600',
        red: 'bg-red-500 text-red-600',
        purple: 'bg-purple-500 text-purple-600',
    };

    const bgColor = colorClasses[color]?.split(' ')[0] || 'bg-gray-500';
    const textColor = colorClasses[color]?.split(' ')[1] || 'text-gray-600';

    return (
        <div className="mb-6 group">
            <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{label}</span>
                <div className="text-right">
                    <span className={`text-xl font-black ${isOver ? 'text-red-500' : textColor}`}>
                        {current}
                    </span>
                    <span className="text-xs text-gray-400 font-bold ml-1">/ {target}{unit}</span>
                </div>
            </div>
            <div className="h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <div
                    className={`h-full ${isOver ? 'bg-red-500' : bgColor} rounded-full transition-all duration-1000 ease-out relative`}
                    style={{ width: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>
        </div>
    );
};

const NutritionProgress = ({ progress }) => {
    if (!progress) return null;

    const { total, goals } = progress;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300 h-full">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-xl text-blue-600 dark:text-blue-400">
                    <TrendingUp size={24} />
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-serif">Today's Progress</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Based on your meal plan</p>
                </div>
            </div>

            <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-2xl border border-gray-100 dark:border-gray-600 text-center">
                <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Total Calories</p>
                <div className="flex items-center justify-center gap-2">
                    <span className="text-5xl font-black text-gray-900 dark:text-white">{Math.round(total.calories)}</span>
                    <span className="text-xl font-bold text-gray-400">/ {goals.dailyCalories}</span>
                </div>
                <div className="mt-4 h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-green-500 rounded-full transition-all duration-1000"
                        style={{ width: `${Math.min((total.calories / goals.dailyCalories) * 100, 100)}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-2">
                <ProgressBar
                    label="Protein"
                    current={Math.round(total.protein)}
                    target={goals.dailyProtein}
                    color="blue"
                />
                <ProgressBar
                    label="Carbs"
                    current={Math.round(total.carbs)}
                    target={goals.dailyCarbs}
                    color="yellow"
                />
                <ProgressBar
                    label="Fats"
                    current={Math.round(total.fats)}
                    target={goals.dailyFats}
                    color="red"
                />
                <ProgressBar
                    label="Fiber"
                    current={Math.round(total.fiber)}
                    target={goals.dailyFiber}
                    color="purple"
                />
            </div>

            <div className={`mt-8 p-4 rounded-xl flex gap-3 ${total.calories > goals.dailyCalories ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                {total.calories > goals.dailyCalories ? (
                    <AlertCircle className="flex-shrink-0" />
                ) : (
                    <CheckCircle className="flex-shrink-0" />
                )}
                <p className="text-sm font-bold">
                    {total.calories > goals.dailyCalories
                        ? "You've exceeded your calorie goal for today. Consider lighter options for your remaining meals."
                        : "You're on track! Keep up the good work with balanced meals."}
                </p>
            </div>
        </div>
    );
};

export default NutritionProgress;
