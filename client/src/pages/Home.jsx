import { useEffect, useState } from "react";
import api from "../api/axios";
import RecipeCard from "../components/RecipeCard";
import { Search, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const categories = ["All", "Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Baking", "Smoothie", "Appetizer"];

    const fetchRecipes = async (query = "", cat = "All") => {
        setLoading(true);
        try {
            const { data } = await api.get(`/recipes?q=${query}&category=${cat}`);
            setRecipes(data);
        } catch (error) {
            console.error("Failed to fetch recipes", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes(searchQuery, selectedCategory);
    }, [selectedCategory]);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchRecipes(searchQuery, selectedCategory);
    };

    return (
        <div className="min-h-screen font-hand bg-white dark:bg-gray-900 transition-colors">
            {/* Hero Section */}
            <div className="relative bg-gray-900 text-white overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1543353071-087f9bcbd111?q=80&w=2070&auto=format&fit=crop"
                        alt="Cooking background"
                        className="w-full h-full object-cover opacity-50 transform scale-105 animate-ken-burns"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-transparent to-gray-900/80"></div>
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 sm:pt-40 sm:pb-32">
                    <div className="text-center max-w-4xl mx-auto space-y-8 animate-in fade-in zoom-in duration-1000">
                        <span className="inline-block py-1.5 px-4 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold tracking-[0.2em] uppercase backdrop-blur-md shadow-xl mb-4">
                            ✨ World Class Culinary AI
                        </span>
                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-hand font-black tracking-tight text-white drop-shadow-2xl leading-[0.9]">
                            Master the Art of <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-200 to-orange-400 animate-gradient-x">Simplicity</span>
                        </h1>
                        <p className="text-xl sm:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed text-shadow-sm">
                            Discover thousands of chef-curated recipes enhanced by AI. Cook smarter, eat better, and explore a world of flavors.
                        </p>

                        <form onSubmit={handleSearch} className="mt-12 max-w-2xl mx-auto relative group z-10">
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary via-accent to-primary rounded-full opacity-60 group-hover:opacity-100 blur-lg transition duration-500 group-hover:duration-200"></div>
                            <div className="relative flex items-center bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-full p-2.5 shadow-2xl transition-transform transform group-hover:scale-[1.01]">
                                <Search className="ml-5 text-gray-400" size={28} />
                                <input
                                    type="text"
                                    placeholder="What are you craving today?"
                                    className="w-full px-5 py-4 text-gray-800 dark:text-white bg-transparent outline-none text-xl font-medium placeholder-gray-400"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <button type="submit" className="px-10 py-4 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-primary dark:to-primary-dark text-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl hover:bg-gray-700 transition-all duration-300">
                                    Search
                                </button>
                            </div>
                        </form>

                        <div className="pt-10 flex flex-wrap justify-center gap-3 pb-4 max-w-full">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 transform hover:-translate-y-1 ${selectedCategory === cat
                                        ? "bg-white text-gray-900 shadow-xl shadow-white/20 scale-105"
                                        : "bg-black/30 text-gray-200 hover:bg-white/20 backdrop-blur-md border border-white/10 hover:border-white/30"
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>

                        <div className="pt-8 flex justify-center gap-8 text-sm font-bold text-gray-300 tracking-wide uppercase">
                            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm"><div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div> 10k+ Recipes</span>
                            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm"><div className="w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div> Community Verified</span>
                            <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm"><div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(249,115,22,0.5)]"></div> AI Powered</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recipes Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gray-50/50 dark:bg-gray-900 transition-colors">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <h2 className="text-2xl font-hand font-bold text-gray-900 dark:text-white">Fresh from the Kitchen</h2>
                        <p className="mt-2 text-gray-500 dark:text-gray-400">The latest creations from our community chefs.</p>
                    </div>
                    <Link to="/collections" className="hidden sm:inline-flex items-center text-primary font-semibold hover:text-primary-dark transition-colors gap-2">
                        View All Collections <ChevronRight size={20} />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3].map((n) => (
                            <div key={n} className="h-96 rounded-2xl bg-gray-200 dark:bg-gray-800 animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                        {recipes.map((recipe) => (
                            <RecipeCard key={recipe._id} recipe={recipe} />
                        ))}
                        {recipes.length === 0 && (
                            <div className="col-span-full py-24 text-center">
                                <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                                    <Search className="text-gray-400" size={40} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No recipes found</h3>
                                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                    We couldn't find any recipes matching your criteria. Try adjusting your search or add a new recipe!
                                </p>
                            </div>
                        )}
                    </div>
                )}


            </div>
        </div>
    );
};

export default Home;
