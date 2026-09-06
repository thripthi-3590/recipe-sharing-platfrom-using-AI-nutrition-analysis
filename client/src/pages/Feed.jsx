import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import RecipeCard from "../components/RecipeCard";
import FeedSidebar from "../components/FeedSidebar";
import { Zap, ChefHat, Heart, MessageCircle, Share2 } from "lucide-react";

const Feed = () => {
    const [recipes, setRecipes] = useState([]);
    const [trendingRecipes, setTrendingRecipes] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedData = async () => {
            try {
                const [feedRes, trendingRes] = await Promise.all([
                    api.get('/users/feed'),
                    api.get('/recipes?limit=4')
                ]);
                setRecipes(feedRes.data);
                setTrendingRecipes(trendingRes.data);
            } catch (error) {
                console.error("Failed to fetch feed data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeedData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Gathering fresh inspiration...</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen transition-colors">
            <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Main Feed Content */}
                    <div className="lg:col-span-8 space-y-16">
                        <header className="relative p-10 sm:p-16 bg-gray-900 rounded-[3.5rem] overflow-hidden group shadow-2xl">
                            <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1543353071-10c8ba85a904?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"></div>
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900/80 to-primary/20"></div>

                            <div className="relative z-10">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="px-4 py-1.5 bg-primary text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full">Explore Community</span>
                                    <span className="w-1.5 h-1.5 rounded-full bg-white/20"></span>
                                    <span className="text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <h1 className="text-5xl sm:text-7xl font-serif font-black text-white mb-6 tracking-tight leading-none">
                                    The Culinary <br /><span className="text-primary italic">Pulse</span>
                                </h1>
                                <p className="text-white/60 text-xl max-w-lg leading-relaxed font-medium">
                                    Fresh inspiration from the chefs you follow. Discover what's simmering in the community today.
                                </p>
                            </div>

                            <div className="absolute top-1/2 -right-8 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity duration-700">
                                <ChefHat size={300} className="text-white rotate-12" />
                            </div>
                        </header>

                        {recipes.length > 0 ? (
                            <div className="space-y-20">
                                {recipes.map((recipe, idx) => (
                                    <div key={recipe._id} className="relative animate-in fade-in duration-1000 slide-in-from-bottom-5">
                                        <div className="absolute -left-10 top-0 bottom-0 w-px bg-gradient-to-b from-primary/20 via-transparent to-transparent hidden xl:block"></div>
                                        <div className="absolute -left-[45px] top-6 w-2.5 h-2.5 rounded-full bg-primary ring-4 ring-primary/10 hidden xl:block"></div>

                                        <RecipeCard recipe={recipe} />

                                        {/* Social Interaction Bar */}
                                        <div className="mt-8 flex items-center gap-8 px-6 py-4 bg-gray-50 dark:bg-gray-800 rounded-3xl border border-gray-100/50 dark:border-gray-700 transition-colors">
                                            <button className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-all font-black text-xs uppercase tracking-widest group">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-colors">
                                                    <Heart size={18} className="group-hover:fill-red-500 dark:group-hover:fill-red-400" />
                                                </div>
                                                <span>24 Likes</span>
                                            </button>
                                            <button className="flex items-center gap-3 text-gray-500 dark:text-gray-400 hover:text-primary transition-all font-black text-xs uppercase tracking-widest group">
                                                <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm group-hover:bg-primary/10 transition-colors">
                                                    <MessageCircle size={18} />
                                                </div>
                                                <span>8 Comments</span>
                                            </button>
                                            <div className="flex-grow"></div>
                                            <button className="w-10 h-10 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition-all hover:-translate-y-1">
                                                <Share2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-40 border-4 border-dashed border-gray-100 dark:border-gray-700 rounded-[4rem] px-8 bg-gray-50/30 dark:bg-gray-800/30 transition-colors">
                                <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-10 shadow-xl border border-gray-50 dark:border-gray-700">
                                    <ChefHat size={48} className="text-gray-200 dark:text-gray-600" />
                                </div>
                                <h2 className="text-4xl font-serif text-gray-900 dark:text-white font-black mb-4">Your feed is currently silent</h2>
                                <p className="text-gray-400 dark:text-gray-500 mb-12 max-w-sm mx-auto text-lg italic font-medium">
                                    The secret ingredient is community. Follow fellow chefs to bring your feed to life with their latest curations.
                                </p>
                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-3 px-12 py-5 bg-gray-900 dark:bg-primary text-white rounded-[2rem] font-black text-lg shadow-2xl hover:bg-primary dark:hover:bg-primary-dark transition-all duration-500 transform hover:-translate-y-2"
                                >
                                    <Zap size={24} />
                                    Meet the Masterminds
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-32 space-y-12">
                            <FeedSidebar trendingRecipes={trendingRecipes} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feed;
