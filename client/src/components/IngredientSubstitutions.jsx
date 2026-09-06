import { useState } from 'react';
import { RefreshCw, ChefHat, ArrowRight } from 'lucide-react';
import api from '../api/axios';

const IngredientSubstitutions = ({ ingredient }) => {
    const [substitutions, setSubstitutions] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    // Mock AI call for now - in real app, this would hit an AI endpoint
    const handleFindSubstitutes = async () => {
        setLoading(true);
        setIsOpen(true);

        // Simulating API delay
        setTimeout(() => {
            const mocks = {
                'milk': ['Almond Milk', 'Soy Milk', 'Oat Milk'],
                'egg': ['Flax Egg', 'Applesauce', 'Banana'],
                'butter': ['Coconut Oil', 'Applesauce', 'Greek Yogurt'],
                'sugar': ['Honey', 'Maple Syrup', 'Stevia'],
                'flour': ['Almond Flour', 'Oat Flour', 'Coconut Flour']
            };

            // Simple keyword matching
            const key = Object.keys(mocks).find(k => ingredient.toLowerCase().includes(k));
            setSubstitutions(key ? mocks[key] : ['No common substitutes found']);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="relative inline-block ml-2">
            {!isOpen ? (
                <button
                    onClick={handleFindSubstitutes}
                    className="p-1 text-gray-400 hover:text-primary transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    title="Find substitutions"
                >
                    <RefreshCw size={14} />
                </button>
            ) : (
                <div className="absolute left-0 top-6 z-10 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 p-4 animate-in fade-in zoom-in duration-200">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                        <span className="text-xs font-bold text-gray-500 uppercase">Substitutes for</span>
                        <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500">&times;</button>
                    </div>

                    {loading ? (
                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                            <RefreshCw size={14} className="animate-spin" /> Analyzing...
                        </div>
                    ) : (
                        <ul className="space-y-2">
                            {substitutions.map((sub, idx) => (
                                <li key={idx} className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                                    <ArrowRight size={12} className="text-primary" /> {sub}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default IngredientSubstitutions;
