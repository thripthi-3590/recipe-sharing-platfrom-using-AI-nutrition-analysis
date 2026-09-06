import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import RecipeCard from "../components/RecipeCard";
import AuthContext from "../context/AuthContext";
import { User as UserIcon, ChefHat, Heart, Users, MapPin, Calendar, Settings, ChevronRight, MessageSquare, Library } from "lucide-react";
import ChatBox from "../components/ChatBox";
import CookingStatsCard from "../components/CookingStatsCard";

const Profile = () => {
    const { id } = useParams();
    const { user: currentUser } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [recipes, setRecipes] = useState([]);
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get(`/users/profile/${id}`);
                setProfile(data.user);
                setRecipes(data.recipes);
                if (currentUser) {
                    setIsFollowing(data.user.followers.includes(currentUser._id));

                    // Fetch collections if this is the current user's profile
                    if (currentUser._id === id) {
                        const collectionsRes = await api.get('/users/collections');
                        setCollections(collectionsRes.data);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id, currentUser]);

    const handleFollow = async () => {
        if (!currentUser) return alert("Please log in to follow chefs!");
        try {
            const { data } = await api.put(`/users/follow/${id}`);
            setIsFollowing(data.isFollowing);
            // Refresh counts locally
            setProfile(prev => ({
                ...prev,
                followers: data.isFollowing
                    ? [...prev.followers, currentUser._id]
                    : prev.followers.filter(fid => fid !== currentUser._id)
            }));
        } catch (error) {
            console.error("Follow failed", error);
        }
    };

    if (loading) return <div className="text-center py-20">Loading chef profile...</div>;
    if (!profile) return <div className="text-center py-20 text-red-500">Chef not found!</div>;

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 pb-32 transition-colors duration-300">
            {/* Premium Header / Cover */}
            <div className="h-[40vh] bg-gray-900 relative overflow-hidden">
                <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-white/10 dark:via-gray-900/10 to-transparent"></div>

                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 md:left-32 md:translate-x-0 group">
                    <div className="w-48 h-48 rounded-[3rem] bg-white dark:bg-gray-800 p-2 shadow-2xl transform transition-transform duration-700 group-hover:scale-105 group-hover:rotate-3">
                        <div className="w-full h-full rounded-[2.5rem] bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden border border-gray-100 dark:border-gray-600">
                            {profile.profilePicture ? (
                                <img src={profile.profilePicture} alt={profile.username} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            ) : (
                                <UserIcon size={72} className="text-gray-300 dark:text-gray-500" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Info Sidebar */}
                    <div className="lg:col-span-4 space-y-10">
                        <div className="relative">
                            <h1 className="text-5xl font-serif font-black text-gray-900 dark:text-white mb-2 tracking-tight">{profile.username}</h1>
                            <div className="flex items-center gap-2 mb-8">
                                <span className="px-4 py-1.5 bg-primary/10 text-primary text-xs font-black uppercase tracking-widest rounded-full">Executive Chef</span>
                                <span className="w-1.5 h-1.5 rounded-full bg-gray-200 dark:bg-gray-700"></span>
                                <span className="text-gray-400 text-sm font-medium">@{profile.username.toLowerCase()}</span>
                            </div>

                            <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-10 font-medium italic">
                                "Bringing gourmet experiences from my kitchen to yours. Passionate about sustainable ingredients and bold flavors."
                            </p>

                            <CookingStatsCard />



                            <div className="flex gap-4 mb-12 mt-10">
                                {currentUser?._id === profile._id ? (
                                    <>
                                        <button className="flex-grow py-4 bg-gray-900 dark:bg-gray-700 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-primary dark:hover:bg-primary transition-all shadow-xl hover:-translate-y-1 active:translate-y-0">
                                            <Settings size={20} /> Edit Profile
                                        </button>

                                    </>
                                ) : (
                                    <button
                                        onClick={handleFollow}
                                        className={`flex-grow py-4 rounded-2xl font-black text-lg transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-2xl ${isFollowing ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' : 'bg-primary text-white shadow-primary/30'}`}
                                    >
                                        {isFollowing ? 'Following' : 'Follow Chef'}
                                    </button>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-6 py-10 border-y border-gray-100 dark:border-gray-800">
                                <div className="text-center group cursor-default">
                                    <p className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{recipes.length}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Recipes</p>
                                </div>
                                <div className="text-center group cursor-default">
                                    <p className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{profile.followers?.length || 0}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Followers</p>
                                </div>
                                <div className="text-center group cursor-default">
                                    <p className="text-3xl font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors">{profile.following?.length || 0}</p>
                                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mt-1">Following</p>
                                </div>
                            </div>

                            <div className="mt-10 space-y-5">
                                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 group">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <MapPin size={20} />
                                    </div>
                                    <span className="text-sm font-bold">Global Kitchen, NY</span>
                                </div>
                                <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300 group">
                                    <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                                        <Calendar size={20} />
                                    </div>
                                    <span className="text-sm font-bold">Joined {new Date(profile.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Chat Box for Chefs */}
                        {currentUser?._id !== profile._id && profile.role === 'chef' && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <MessageSquare className="text-primary" size={20} />
                                    <h3 className="font-bold text-gray-900 dark:text-white">Request a Custom Recipe</h3>
                                </div>
                                <div className="h-64">
                                    <ChatBox />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center justify-between mb-12">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
                                    <ChefHat size={24} />
                                </div>
                                <h2 className="text-3xl font-serif font-black text-gray-900 dark:text-white">
                                    {currentUser?._id === profile._id ? "My Portfolio" : "Chef's Portfolio"}
                                </h2>
                            </div>
                        </div>

                        {recipes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
                                {recipes.map(recipe => (
                                    <div key={recipe._id} className="animate-in fade-in duration-700 slide-in-from-bottom-5">
                                        <RecipeCard recipe={{ ...recipe, user: profile }} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-40 bg-gray-50 dark:bg-gray-800 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-gray-700 px-6 mb-20">
                                <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
                                    <ChefHat size={48} className="text-gray-200 dark:text-gray-600" />
                                </div>
                                <h3 className="text-2xl font-serif text-gray-900 dark:text-white font-bold mb-2">Kitchen is quiet...</h3>
                                <p className="text-gray-400 text-lg italic max-w-sm mx-auto">This chef hasn't published any secret recipes yet.</p>
                            </div>
                        )}

                        {currentUser?._id === profile._id && collections.length > 0 && (
                            <div className="mt-20">
                                <div className="flex items-center justify-between mb-12">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                                            <Library size={24} />
                                        </div>
                                        <h2 className="text-3xl font-serif font-black text-gray-900 dark:text-white">My Collections</h2>
                                    </div>
                                    <Link to="/collections" className="text-primary font-bold hover:underline">View All</Link>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {collections.slice(0, 4).map(col => (
                                        <Link key={col._id} to={`/collections/${col._id}`} className="group bg-gray-50 dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-750 hover:shadow-xl transition-all duration-300">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{col.name}</h3>
                                                <span className="text-xs font-bold text-gray-400 bg-white dark:bg-gray-700 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-600">
                                                    {col.recipes?.length || 0} Recipes
                                                </span>
                                            </div>
                                            <div className="flex items-center text-primary font-bold text-sm">
                                                Browse Collection <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
