import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Trash2, Search, ExternalLink, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageRecipes = () => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchRecipes = async () => {
        try {
            const { data } = await api.get('/admin/recipes');
            setRecipes(data);
        } catch (error) {
            console.error("Error fetching recipes:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecipes();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                await api.delete(`/admin/recipes/${id}`);
                setRecipes(recipes.filter(recipe => recipe._id !== id));
            } catch (error) {
                console.error("Error deleting recipe:", error);
                alert("Failed to delete recipe");
            }
        }
    };

    const filteredRecipes = recipes.filter(recipe =>
        (recipe.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (recipe.user?.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading recipes...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Manage Recipes</h1>
                    <p className="text-gray-500">Oversee all recipes shared on the platform</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search recipes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRecipes.map((recipe) => (
                    <div key={recipe._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-48 relative overflow-hidden bg-gray-100">
                            {recipe.imageUrl ? (
                                <img src={recipe.imageUrl} alt={recipe.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl">🥘</div>
                            )}
                            <div className="absolute top-3 right-3 flex gap-2">
                                <Link
                                    to={`/recipes/${recipe._id}`}
                                    className="p-2 bg-white/90 backdrop-blur rounded-full text-gray-700 hover:text-primary transition-colors shadow-sm"
                                    title="View Public Page"
                                >
                                    <ExternalLink size={16} />
                                </Link>
                                <button
                                    onClick={() => handleDelete(recipe._id)}
                                    className="p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                    title="Delete Recipe"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{recipe.title}</h3>
                            <div className="text-sm text-gray-500 mb-4 flex items-center gap-1">
                                by <span className="font-medium text-gray-800">@{recipe.user?.username || 'Unknown'}</span>
                            </div>

                            <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-gray-50">
                                <div className="flex items-center gap-1">
                                    <Flame size={14} className="text-orange-500" />
                                    <span>{Math.round(recipe.nutrition?.calories || 0)} kcal</span>
                                </div>
                                <div>
                                    {new Date(recipe.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredRecipes.length === 0 && (
                <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200 text-gray-500">
                    No recipes found matching your search.
                </div>
            )}
        </div>
    );
};

export default ManageRecipes;
