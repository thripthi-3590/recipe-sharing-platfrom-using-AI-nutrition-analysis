import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Folder, Plus, ChevronRight, BookOpen } from "lucide-react";
import api from "../api/axios";

const Collections = () => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCollectionName, setNewCollectionName] = useState("");
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        try {
            const { data } = await api.get("/users/collections");
            setCollections(data);
        } catch (error) {
            console.error("Failed to fetch collections", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateCollection = async (e) => {
        e.preventDefault();
        if (!newCollectionName.trim()) return;

        try {
            const { data } = await api.post("/users/collections", { name: newCollectionName });
            setCollections([...collections, data]);
            setNewCollectionName("");
            setShowCreateModal(false);
        } catch (error) {
            console.error("Failed to create collection", error);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading folders...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">My Folders</h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">Organize your favorite recipes into custom collections.</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                    <Plus size={20} />
                    New Folder
                </button>
            </div>

            {showCreateModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-md p-6 transform transition-all border border-gray-100 dark:border-gray-700">
                        <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Create New Folder</h3>
                        <form onSubmit={handleCreateCollection}>
                            <input
                                type="text"
                                value={newCollectionName}
                                onChange={(e) => setNewCollectionName(e.target.value)}
                                placeholder="e.g., Summer Dinner Ideas"
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-2 focus:ring-primary focus:border-transparent outline-none mb-4 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                                autoFocus
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!newCollectionName.trim()}
                                    className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {collections.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 transition-colors">
                    <Folder className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No folders yet</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first folder to start organizing your recipes!</p>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="text-primary font-bold hover:underline"
                    >
                        Create Folder
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {collections.map((collection) => (
                        <Link
                            key={collection._id}
                            to={`/collections/${collection._id}`}
                            className="group block bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-xl hover:border-primary/30 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="p-3 bg-orange-50 dark:bg-primary/20 rounded-lg group-hover:bg-primary/10 transition-colors">
                                    <Folder className="h-8 w-8 text-primary" />
                                </div>
                                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-full border border-gray-100 dark:border-gray-600">
                                    {collection.recipes?.length || 0} recipes
                                </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                {collection.name}
                            </h3>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                                <span>View Collection</span>
                                <ChevronRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Collections;
