import { useState } from 'react';
import { Scale, RotateCcw } from 'lucide-react';
import api from '../api/axios';

const RecipeScaler = ({ originalServings, onScale, recipeId }) => {
    const [servings, setServings] = useState(originalServings);
    const [loading, setLoading] = useState(false);

    const handleScale = async () => {
        setLoading(true);
        try {
            const { data } = await api.post(`/recipes/${recipeId}/scale`, { newServings: Number(servings) });
            onScale(data); // Pass scaled data back to parent
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-600">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-bold">
                    <Scale size={20} />
                    <span>Adjust Servings</span>
                </div>
                <span className="text-2xl font-black text-primary">{servings}</span>
            </div>

            <input
                type="range"
                min="1"
                max="20"
                value={servings}
                onChange={(e) => setServings(e.target.value)}
                className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-primary mb-4"
            />

            <div className="flex gap-3">
                <button
                    onClick={handleScale}
                    disabled={loading || servings == originalServings}
                    className="flex-1 py-2 bg-primary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Scaling...' : 'Update Ingredients'}
                </button>
                <button
                    onClick={() => setServings(originalServings)}
                    className="px-3 py-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-xl font-bold text-sm border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                    <RotateCcw size={18} />
                </button>
            </div>
        </div>
    );
};

export default RecipeScaler;
