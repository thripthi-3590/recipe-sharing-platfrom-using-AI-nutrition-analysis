import { useState, useEffect, useContext } from 'react';
import api from '../api/axios';
import RecipeCard from '../components/RecipeCard';
import { Heart, Loader2, ChefHat } from 'lucide-react';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';

const SavedRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        const fetchSavedRecipes = async () => {
            try {
                setLoading(true);
                const response = await api.get('/users/favorites');
                setRecipes(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching saved recipes:", err);
                setError('Failed to load your cookbook. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchSavedRecipes();
        }
    }, [user, user?.favorites]); // Re-fetch when user or favorites change

    if (loading) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Opening your cookbook...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                    <ChefHat className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Oops!</h2>
                <p className="text-gray-600 mb-6">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-primary text-white rounded-full font-bold shadow-lg shadow-primary/30 hover:-translate-y-0.5 transition-all"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <header className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-inner border border-white dark:border-red-900/30">
                            <Heart className="w-8 h-8 text-red-500 fill-red-500/10" />
                        </div>
                        <h1 className="font-serif text-5xl font-black text-gray-900 dark:text-white tracking-tight">The Digital Cookbook</h1>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-lg font-medium max-w-xl italic">
                        "Your curated sanctuary of flavors, techniques, and culinary memories."
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-xl transition-colors">
                    <div className="w-10 h-10 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <ChefHat size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase font-black tracking-widest leading-none mb-1">Total Curated</p>
                        <p className="text-lg font-black text-gray-900 dark:text-white leading-none">{recipes.length} <span className="text-sm font-medium text-gray-400">Recipes</span></p>
                    </div>
                </div>
            </header>

            {recipes.length === 0 ? (
                <div className="text-center py-40 bg-gray-50 dark:bg-gray-800/50 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-gray-700 px-6 transition-colors">
                    <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl border border-gray-50 dark:border-gray-700">
                        <Heart className="w-12 h-12 text-gray-200 dark:text-gray-600" />
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-gray-900 dark:text-white mb-4">Your cookbook is blank</h3>
                    <p className="text-gray-400 dark:text-gray-500 text-lg italic mb-12 max-w-sm mx-auto">
                        Save recipes you love by clicking the heart icon, and they'll appear here in your personal cookbook.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-3 px-10 py-5 bg-gray-900 dark:bg-primary text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-primary dark:hover:bg-primary-dark transition-all duration-500 transform hover:-translate-y-2"
                    >
                        <ChefHat size={24} />
                        Discover Masterpieces
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                    {recipes.map((recipe) => (
                        <div key={recipe._id} className="animate-in fade-in duration-700 slide-in-from-bottom-5">
                            <RecipeCard recipe={recipe} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedRecipes;
