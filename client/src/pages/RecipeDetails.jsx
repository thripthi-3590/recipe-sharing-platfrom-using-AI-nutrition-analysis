import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Clock, User as UserIcon, ArrowLeft, Heart, MessageSquare, Send, Star, Share2, Printer, ShoppingCart, Info, TrendingUp, Sparkles, Scale, Play, Pause, RotateCcw, Library, CheckCircle } from "lucide-react";
import AuthContext from "../context/AuthContext";
import RecipeScaler from "../components/RecipeScaler"; // Added
import IngredientSubstitutions from "../components/IngredientSubstitutions"; // Added

const RecipeDetails = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, toggleFavorite } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [substitutions, setSubstitutions] = useState({});
    const [loadingSubs, setLoadingSubs] = useState({});
    const [activeTimers, setActiveTimers] = useState({});
    const [showUnitConverter, setShowUnitConverter] = useState(false);
    const [collections, setCollections] = useState([]);
    const [showCollectionModal, setShowCollectionModal] = useState(false);
    const [addingToCol, setAddingToCol] = useState(false);

    const [scaledIngredients, setScaledIngredients] = useState([]);
    const [cookingNote, setCookingNote] = useState("");
    const [showCookedModal, setShowCookedModal] = useState(false);

    const isFavorite = user && user.favorites && recipe && user.favorites.some(id => id.toString() === recipe._id.toString());

    useEffect(() => {
        const fetchRecipe = async () => {
            try {
                const { data } = await api.get(`/recipes/${id}`);
                setRecipe(data);
                setScaledIngredients(data.ingredients.split('\n'));
            } catch (error) {
                console.error("Failed to fetch recipe", error);
            } finally {
                setLoading(false);
            }
        };
        // ... existing fetchComments and fetchCollections ... 
        const fetchComments = async () => {
            try {
                const { data } = await api.get(`/recipes/${id}/comments`);
                setComments(data);
            } catch (error) {
                console.error("Failed to fetch comments", error);
            }
        };

        const fetchCollections = async () => {
            if (user) {
                try {
                    const { data } = await api.get('/users/collections');
                    setCollections(data);
                } catch (error) {
                    console.error("Failed to fetch collections", error);
                }
            }
        };

        fetchRecipe();
        fetchComments();
        fetchCollections();
    }, [id, user]);

    // ... existing handlers (handleToggleFavorite, handleRate, handleAddToShoppingList, handleAddToCollection, handlePrint, handleShare, handleCommentSubmit) ...
    const handleToggleFavorite = async () => {
        if (!user) {
            alert("Please log in to save recipes!");
            return;
        }
        await toggleFavorite(recipe._id);
    };

    const handleRate = async (rating) => {
        if (!user) {
            alert("Please log in to rate!");
            return;
        }
        try {
            const { data } = await api.post(`/recipes/${id}/rate`, { rating });
            setRecipe(data);
        } catch (error) {
            console.error("Failed to rate recipe", error);
        }
    };

    const handleAddToShoppingList = async () => {
        if (!user) {
            alert("Please log in to manage your shopping list!");
            return;
        }
        try {
            const items = scaledIngredients.filter(i => i.trim());
            await api.put('/users/shopping-list', { items, action: 'add' });
            alert("Ingredients added to your shopping list!");
        } catch (error) {
            console.error("Failed to add to shopping list", error);
        }
    };

    const handleAddToCollection = async (collectionId) => {
        setAddingToCol(true);
        try {
            await api.post('/users/collections/add', { collectionId, recipeId: recipe._id });
            alert("Recipe added to collection!");
            setShowCollectionModal(false);
        } catch (error) {
            console.error("Failed to add to collection", error);
            alert("Failed to add to collection.");
        } finally {
            setAddingToCol(false);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert("Please log in to comment!");
            return;
        }
        if (!newComment.trim()) return;

        try {
            setSubmittingComment(true);
            const { data } = await api.post(`/recipes/${id}/comments`, { text: newComment });
            setComments([data, ...comments]);
            setNewComment("");
        } catch (error) {
            console.error("Failed to submit comment", error);
            alert("Failed to submit comment. Please try again.");
        } finally {
            setSubmittingComment(false);
        }
    };


    const handleScale = (data) => {
        if (data.scaledIngredients) {
            setScaledIngredients(data.scaledIngredients);
        }
    };

    const handleMarkAsCooked = async () => {
        try {
            await api.post('/cooking-history', {
                recipeId: recipe._id,
                notes: cookingNote,
                rating: 5 // Default High rating for self-cooked :P or handle logic later
            });
            setShowCookedModal(false);
            alert("Woohoo! Recipe marked as cooked! 🎉");
        } catch (error) {
            console.error(error);
            alert("Failed to mark as cooked");
        }
    };

    // ... existing handleToggleTimer, formatTime ...
    const handleToggleTimer = (index, minutes) => {
        if (activeTimers[index]) {
            clearInterval(activeTimers[index].interval);
            setActiveTimers(prev => {
                const newTimers = { ...prev };
                delete newTimers[index];
                return newTimers;
            });
        } else {
            let seconds = minutes * 60;
            const interval = setInterval(() => {
                seconds--;
                if (seconds <= 0) {
                    clearInterval(interval);
                    alert(`Step ${index + 1} timer finished!`);
                    setActiveTimers(prev => {
                        const newTimers = { ...prev };
                        delete newTimers[index];
                        return newTimers;
                    });
                } else {
                    setActiveTimers(prev => ({
                        ...prev,
                        [index]: { ...prev[index], remaining: seconds }
                    }));
                }
            }, 1000);
            setActiveTimers(prev => ({
                ...prev,
                [index]: { interval, remaining: seconds }
            }));
        }
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };


    if (loading) return <div className="text-center py-20 text-gray-500 dark:text-gray-400">Loading recipe details...</div>;
    if (!recipe) return <div className="text-center py-20 text-red-500">Recipe not found!</div>;

    const data = [
        { name: 'Protein', value: recipe.nutrition?.protein || 0, color: '#3B82F6' },
        { name: 'Carbs', value: recipe.nutrition?.carbs || 0, color: '#F59E0B' },
        { name: 'Fats', value: recipe.nutrition?.fats || 0, color: '#10B981' },
        { name: 'Fiber', value: recipe.nutrition?.fiber || 0, color: '#8B5CF6' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-32">
            <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-primary mb-8 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center mr-2 shadow-sm group-hover:border-primary group-hover:text-primary transition-all">
                    <ArrowLeft size={16} />
                </div>
                Back to Recipes
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Main Content */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Hero for Recipe */}
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[400px] mb-8 group">
                        {recipe.imageUrl ? (
                            <img
                                src={recipe.imageUrl}
                                alt={recipe.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-400">
                                <span className="text-6xl">🥘</span>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute top-6 right-6 z-10 flex gap-3">
                            <button
                                onClick={handleShare}
                                className="p-3 rounded-full backdrop-blur-md bg-white/20 text-white hover:bg-white hover:text-primary transition-all shadow-md"
                                title="Copy Link"
                            >
                                <Share2 size={24} />
                            </button>
                            <button
                                onClick={() => setShowCookedModal(true)}
                                className="p-3 rounded-full backdrop-blur-md bg-white/20 text-white hover:bg-green-500 hover:text-white transition-all shadow-md"
                                title="Mark as Cooked"
                            >
                                <CheckCircle size={24} />
                            </button>
                            <button
                                onClick={handlePrint}
                                className="p-3 rounded-full backdrop-blur-md bg-white/20 text-white hover:bg-white hover:text-gray-900 transition-all shadow-md"
                                title="Print Recipe"
                            >
                                <Printer size={24} />
                            </button>

                            {user && (
                                <button
                                    onClick={() => setShowCollectionModal(!showCollectionModal)}
                                    className="p-3 rounded-full backdrop-blur-md bg-white/20 text-white hover:bg-white hover:text-purple-600 transition-all shadow-md"
                                    title="Add to Collection"
                                >
                                    <Library size={24} />
                                </button>
                            )}

                            <button
                                onClick={handleToggleFavorite}
                                className={`p-3 rounded-full backdrop-blur-md transition-all duration-300 shadow-md transform hover:scale-105 ${isFavorite ? 'bg-white text-red-500' : 'bg-white/20 text-white hover:bg-white hover:text-red-500'}`}
                                title={isFavorite ? "Remove from Cookbook" : "Save to Cookbook"}
                            >
                                <Heart size={24} fill={isFavorite ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Mark as Cooked Modal */}
                        {showCookedModal && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center p-4">
                                <div className="bg-white dark:bg-gray-800 rounded-[2rem] w-full max-w-sm p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Did you cook this?</h3>
                                        <button onClick={() => setShowCookedModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl">×</button>
                                    </div>
                                    <textarea
                                        value={cookingNote}
                                        onChange={(e) => setCookingNote(e.target.value)}
                                        placeholder="Add a note about your cooking experience (optional)..."
                                        className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500/50 mb-4 h-32 resize-none text-gray-900 dark:text-white"
                                    />
                                    <button
                                        onClick={handleMarkAsCooked}
                                        className="w-full py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all shadow-lg shadow-green-500/30"
                                    >
                                        Yes, I cooked it!
                                    </button>
                                </div>
                            </div>
                        )}


                        {/* Collection Selection Modal Overlay */}
                        {showCollectionModal && (
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-20 flex items-center justify-center p-4">
                                <div className="bg-white dark:bg-gray-800 rounded-[2rem] w-full max-w-sm p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Save to Collection</h3>
                                        <button onClick={() => setShowCollectionModal(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white text-2xl">×</button>
                                    </div>
                                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        {collections.length > 0 ? (
                                            collections.map(col => (
                                                <button
                                                    key={col._id}
                                                    onClick={() => handleAddToCollection(col._id)}
                                                    disabled={addingToCol}
                                                    className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/30 hover:text-purple-700 dark:hover:text-purple-400 text-left font-bold transition-all flex items-center justify-between group text-gray-700 dark:text-gray-200"
                                                >
                                                    <span>{col.name}</span>
                                                    <Library size={18} className="text-gray-300 group-hover:text-purple-500" />
                                                </button>
                                            ))
                                        ) : (
                                            <div className="text-center py-6">
                                                <p className="text-gray-500 text-sm mb-4">You don't have any collections yet.</p>
                                                <Link to="/collections" className="text-primary font-bold hover:underline">Create One</Link>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-10 text-white">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{recipe.category}</span>
                                <div className="flex items-center gap-1 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-xs font-bold">
                                    <Star size={14} fill="currentColor" /> {recipe.averageRating || "New"}
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-4 text-shadow leading-tight">{recipe.title}</h1>
                            <div className="flex flex-wrap items-center gap-6 text-sm sm:text-base font-medium text-white/90">
                                <Link to={`/profile/${recipe.user?._id}`} className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-full hover:bg-white/30 transition-colors">
                                    <UserIcon size={18} /> {recipe.user?.username || 'Unknown Chef'}
                                </Link>
                                <span className="flex items-center gap-2"><Clock size={18} /> {recipe.prepTime + recipe.cookTime} mins total</span>
                                <span className="flex items-center gap-2 capitalize"><TrendingUp size={18} /> {recipe.difficulty}</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center transition-colors">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Prep Time</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{recipe.prepTime}m</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center transition-colors">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Cook Time</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{recipe.cookTime}m</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center transition-colors">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Difficulty</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{recipe.difficulty}</p>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm text-center transition-colors">
                            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold mb-1">Category</p>
                            <p className="text-lg font-bold text-gray-900 dark:text-white">{recipe.category}</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 hover:shadow-md transition-all">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-serif font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                                    Ingredients
                                </h2>
                                <button
                                    onClick={handleAddToShoppingList}
                                    className="text-xs font-bold text-primary hover:text-primary-dark flex items-center gap-1 bg-primary/5 px-3 py-2 rounded-lg transition-colors"
                                >
                                    <ShoppingCart size={14} /> Add All
                                </button>
                            </div>

                            <div className="mb-6">
                                <RecipeScaler
                                    originalServings={recipe.servings || 4}
                                    onScale={handleScale}
                                    recipeId={recipe._id}
                                />
                            </div>

                            <ul className="space-y-3">
                                {scaledIngredients.map((line, i) => (
                                    line.trim() && (
                                        <li key={i} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                                            <div className="w-2 h-2 mt-2 rounded-full bg-primary flex-shrink-0" />
                                            <div className="flex-grow">
                                                <div className="flex items-center flex-wrap gap-1">
                                                    <span className="text-gray-700 dark:text-gray-300 leading-relaxed font-medium">{line}</span>
                                                    <IngredientSubstitutions ingredient={line} /> {/* Added */}
                                                </div>
                                            </div>
                                        </li>
                                    )
                                ))}
                            </ul>

                            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-700 text-center">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Saved it to Cookbook? Rate it!</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <button
                                            key={s}
                                            onClick={() => handleRate(s)}
                                            className="transform transition-transform hover:scale-125 focus:outline-none"
                                        >
                                            <Star
                                                size={32}
                                                className={s <= (recipe.ratings?.find(r => r.user === user?._id)?.rating || 0) ? "text-yellow-400" : "text-gray-200 dark:text-gray-600"}
                                                fill={s <= (recipe.ratings?.find(r => r.user === user?._id)?.rating || 0) ? "currentColor" : "none"}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 hover:shadow-md transition-all">
                            <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900 dark:text-white flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                                Instructions
                            </h2>
                            <div className="space-y-6">
                                {recipe.instructions.split('\n').map((line, i) => (
                                    line.trim() && (
                                        <div key={i} className="flex gap-4">
                                            <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 border-gray-200 dark:border-gray-600 text-gray-400 dark:text-gray-500 font-bold text-xs flex items-center justify-center mt-0.5">
                                                {i + 1}
                                            </span>
                                            <div className="flex-grow">
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{line}</p>
                                                {/* Simple Timer Detection (Mock) */}
                                                {line.match(/\d+\s*min/i) && (
                                                    <button
                                                        onClick={() => handleToggleTimer(i, parseInt(line.match(/\d+/)[0]))}
                                                        className={`mt-2 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeTimers[i] ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                                    >
                                                        {activeTimers[i] ? <Pause size={12} /> : <Play size={12} />}
                                                        {activeTimers[i] ? formatTime(activeTimers[i].remaining) : `${line.match(/\d+/)[0]} Min Timer`}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Mobile suggestion view */}
                    <div className="lg:hidden">
                        <SuggestionsPanel suggestions={recipe.aiSuggestions} />
                    </div>
                </div>

                {/* Comments Section */}
                <div className="lg:col-span-8 mt-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-colors">
                    <h3 className="text-2xl font-serif font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <MessageSquare className="text-primary" />
                        Comments ({comments.length})
                    </h3>

                    {user ? (
                        <form onSubmit={handleCommentSubmit} className="mb-8">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary-dark flex items-center justify-center text-white font-bold flex-shrink-0">
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-grow relative">
                                    <textarea
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Share your thoughts on this recipe..."
                                        className="w-full p-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-24 transition-shadow bg-gray-50 dark:bg-gray-700 focus:bg-white dark:focus:bg-gray-600 text-gray-900 dark:text-white"
                                    />
                                    <button
                                        type="submit"
                                        disabled={submittingComment || !newComment.trim()}
                                        className="absolute bottom-3 right-3 p-2 bg-primary text-white rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/30"
                                    >
                                        <Send size={18} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 text-center mb-8 border border-gray-100 dark:border-gray-600">
                            <p className="text-gray-600 dark:text-gray-300 mb-2">Join the conversation!</p>
                            <Link to="/login" className="text-primary font-bold hover:underline">Log in</Link> to post a comment.
                        </div>
                    )}

                    <div className="space-y-6">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment._id} className="flex gap-4">
                                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center overflow-hidden flex-shrink-0">
                                        {comment.user?.profilePicture ? (
                                            <img src={comment.user.profilePicture} alt={comment.user.username} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-500 dark:text-gray-300 font-bold">{comment.user?.username?.charAt(0).toUpperCase() || '?'}</span>
                                        )}
                                    </div>
                                    <div className="flex-grow">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-bold text-gray-900 dark:text-white">{comment.user?.username || 'Unknown'}</span>
                                            <span className="text-xs text-gray-400">• {new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-700/50 rounded-r-xl rounded-bl-xl p-3 inline-block">
                                            {comment.text}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 italic text-center py-4">No comments yet. Be the first to share your thoughts!</p>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Nutrition Chart */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-24 transition-colors">
                        <h3 className="font-bold text-xl text-gray-900 dark:text-white mb-6 text-center font-serif">Nutritional Breakdown</h3>
                        <div className="h-64 w-full relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {data.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-4xl font-black text-gray-800 dark:text-white tracking-tight">{Math.round(recipe.nutrition?.calories || 0)}</span>
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Calories</span>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700">
                            <SuggestionsPanel suggestions={recipe.aiSuggestions} />
                        </div>
                    </div>
                </div>
            </div>



            {/* Floating Unit Converter */}
            <div className="fixed bottom-8 right-8 z-40">
                {showUnitConverter ? (
                    <div className="bg-white rounded-[32px] p-6 shadow-2xl border border-gray-100 w-64 mb-4 animate-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-bold text-gray-900 flex items-center gap-2">
                                <Scale size={18} className="text-primary" /> Converter
                            </h4>
                            <button onClick={() => setShowUnitConverter(false)} className="text-gray-400 hover:text-gray-900">×</button>
                        </div>
                        <div className="space-y-4">
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Cups to Grams (Flour)</p>
                                <p className="text-sm font-bold text-gray-900">1 Cup = 120g</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Ounces to Grams</p>
                                <p className="text-sm font-bold text-gray-900">1 oz = 28.3g</p>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Celsius to Fahrenheit</p>
                                <p className="text-sm font-bold text-gray-900">200°C = 400°F</p>
                            </div>
                        </div>
                    </div>
                ) : null}
                <button
                    onClick={() => setShowUnitConverter(!showUnitConverter)}
                    className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-primary transition-all hover:scale-110 active:scale-95"
                >
                    <Scale size={28} />
                </button>
            </div>
        </div>
    );
};

const SuggestionsPanel = ({ suggestions }) => (
    <div className="bg-green-50 rounded-xl shadow-sm border border-green-100 p-6">
        <h3 className="font-bold text-lg text-green-800 mb-4 flex items-center gap-2">
            <span>✨ AI Health Tips</span>
        </h3>
        {suggestions && suggestions.length > 0 ? (
            <ul className="space-y-3">
                {suggestions.map((tip, idx) => (
                    <li key={idx} className="text-sm text-green-700 leading-snug flex gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        {tip}
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-sm text-green-600 italic">No specific suggestions for this recipe.</p>
        )}
    </div>
);

export default RecipeDetails;
