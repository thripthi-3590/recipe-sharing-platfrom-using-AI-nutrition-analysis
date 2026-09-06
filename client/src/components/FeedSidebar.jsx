import { TrendingUp, Users, Trophy, ChevronRight, Star, UserPlus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/AuthContext";
import api from "../api/axios";

const FeedSidebar = ({ trendingRecipes = [] }) => {
    const { user, setUser } = useContext(AuthContext);
    const [topChefs, setTopChefs] = useState([]);
    const [loadingChefs, setLoadingChefs] = useState(true);

    useEffect(() => {
        const fetchTopChefs = async () => {
            try {
                const { data } = await api.get('/users/top-chefs');
                setTopChefs(data);
            } catch (error) {
                console.error("Failed to fetch top chefs", error);
            } finally {
                setLoadingChefs(false);
            }
        };
        fetchTopChefs();
    }, []);

    const handleToggleFollow = async (chefId) => {
        if (!user) return alert("Please log in to follow chefs!");
        try {
            const { data } = await api.put(`/users/follow/${chefId}`);

            // Update local user following state
            setUser(prev => ({
                ...prev,
                following: data.isFollowing
                    ? [...prev.following, chefId]
                    : prev.following.filter(id => id !== chefId)
            }));

        } catch (error) {
            console.error("Follow failed", error);
        }
    };

    return (
        <aside className="space-y-12">
            {/* ... Existing Trending and Elite Chefs sections ... */}
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-700 shadow-xl shadow-gray-200/50 dark:shadow-none transition-colors">
                <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-orange-50 dark:bg-orange-900/20 text-orange-500 rounded-2xl shadow-inner border border-white dark:border-orange-900/30">
                            <TrendingUp size={24} />
                        </div>
                        <h2 className="text-2xl font-serif font-black text-gray-900 dark:text-white tracking-tight">Trending</h2>
                    </div>
                </div>

                <div className="space-y-8">
                    {trendingRecipes.length > 0 ? (
                        trendingRecipes.slice(0, 4).map((recipe, index) => (
                            <Link
                                key={recipe._id}
                                to={`/recipes/${recipe._id}`}
                                className="flex gap-5 group items-center"
                            >
                                <div className="relative flex-shrink-0 w-20 h-20 rounded-[1.5rem] overflow-hidden bg-gray-100 dark:bg-gray-700 shadow-lg transition-transform duration-500 group-hover:scale-105 group-hover:-rotate-2">
                                    {recipe.imageUrl ? (
                                        <img
                                            src={recipe.imageUrl}
                                            alt={recipe.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">🥘</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="absolute top-2 left-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md text-gray-900 dark:text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm">
                                        #{index + 1}
                                    </div>
                                </div>
                                <div className="flex-grow min-w-0">
                                    <h3 className="text-sm font-black text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                                        {recipe.title}
                                    </h3>
                                    <div className="flex items-center gap-1.5 mt-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary/30"></div>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">
                                            @{recipe.user?.username || 'Chef'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-sm text-gray-400 dark:text-gray-500 italic font-medium px-4 py-8 bg-gray-50 dark:bg-gray-700/30 rounded-2xl text-center border border-dashed border-gray-100 dark:border-gray-700">The heat is coming. Stay tuned.</p>
                    )}
                </div>

                <button className="w-full mt-10 py-4 bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-gray-900 dark:hover:bg-primary hover:text-white transition-all duration-300 shadow-sm">
                    View Leaderboard
                </button>
            </div>

            {/* Elite Chefs / Top Performers */}
            <div className="bg-gray-900 dark:bg-black rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[60px]"></div>

                <div className="flex items-center gap-3 mb-10 relative z-10">
                    <div className="p-2.5 bg-white/10 text-primary rounded-2xl backdrop-blur-md border border-white/10">
                        <Trophy size={24} />
                    </div>
                    <h2 className="text-2xl font-serif font-black tracking-tight">Elite Chefs</h2>
                </div>

                <div className="space-y-6 relative z-10">
                    {loadingChefs ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5"></div>
                                    <div className="space-y-2">
                                        <div className="w-20 h-3 bg-white/5 rounded"></div>
                                        <div className="w-12 h-2 bg-white/5 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        topChefs.map((chef) => {
                            const isFollowing = user?.following?.includes(chef._id);
                            return (
                                <div key={chef._id} className="flex items-center justify-between group/item">
                                    <Link to={`/profile/${chef._id}`} className="flex items-center gap-4">
                                        <div className="relative">
                                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-sm font-black text-white border border-white/10 group-hover/item:scale-110 transition-transform overflow-hidden">
                                                {chef.profilePicture ? (
                                                    <img src={chef.profilePicture} alt={chef.username} className="w-full h-full object-cover" />
                                                ) : chef.username.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-lg flex items-center justify-center border-2 border-gray-900 shadow-lg scale-0 group-hover/item:scale-100 transition-transform">
                                                <Star size={10} className="text-white fill-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-black tracking-tight group-hover/item:text-primary transition-colors">Chef {chef.username}</p>
                                            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{chef.recipeCount} Curations</p>
                                        </div>
                                    </Link>
                                    {user?._id !== chef._id && (
                                        <button
                                            onClick={() => handleToggleFollow(chef._id)}
                                            className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest transition-all ${isFollowing ? 'text-white/40 bg-white/5 px-3 py-1.5 rounded-lg' : 'text-primary hover:text-white'}`}
                                        >
                                            {isFollowing ? (
                                                <><Check size={12} /> Following</>
                                            ) : (
                                                <><UserPlus size={12} /> Follow</>
                                            )}
                                        </button>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* High Impact CTA */}
            <div className="bg-primary rounded-[2.5rem] p-10 text-white overflow-hidden relative group shadow-2xl shadow-primary/30">
                <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-3xl transition-transform group-hover:scale-150 duration-1000"></div>
                <Users size={56} className="mb-6 text-white/20 transform group-hover:-rotate-12 transition-transform" />
                <h2 className="text-3xl font-serif font-black mb-4 leading-tight tracking-tight">
                    {user?.role === 'admin' ? "The Culinary Secret is You." : "Join the Flavor Revolution."}
                </h2>
                <p className="text-white/70 text-sm mb-10 font-medium leading-relaxed">
                    {user?.role === 'admin'
                        ? "Don't just watch — inspire. Share your own masterpieces and lead the flavor revolution."
                        : "Discover curated masterpieces from elite chefs and elevate your culinary journey today."}
                </p>
                <Link
                    to={user?.role === 'admin' ? "/create-recipe" : "/"}
                    className="flex items-center justify-center gap-3 w-full py-5 bg-white text-primary rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-gray-50 transition-all hover:-translate-y-1 active:translate-y-0"
                >
                    <span>{user?.role === 'admin' ? "Unleash A Recipe" : "Explore Our Cookbook"}</span>
                    <ChevronRight size={16} />
                </Link>
            </div>
        </aside>
    );
};

export default FeedSidebar;
