import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Clock, Users } from "lucide-react";
import api from "../api/axios";
import RecipeCard from "../components/RecipeCard";

const CollectionDetails = () => {
    const { id } = useParams();
    const [collection, setCollection] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCollection = async () => {
            try {
                const { data } = await api.get(`/users/collections/${id}`);
                setCollection(data);
            } catch (error) {
                console.error("Failed to fetch collection", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCollection();
    }, [id]);

    if (loading) return <div className="p-8 text-center">Loading folder details...</div>;
    if (!collection) return <div className="p-8 text-center">Folder not found</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/collections" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                <ArrowLeft className="mr-2" size={20} />
                Back to Folders
            </Link>

            <div className="mb-10">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">{collection.name}</h1>
                <p className="text-gray-500">{collection.recipes?.length || 0} saved recipes</p>
            </div>

            {collection.recipes && collection.recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
                    {collection.recipes.map((recipe) => (
                        <RecipeCard key={recipe._id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-2xl">
                    <p className="text-gray-500 mb-4">This folder is empty.</p>
                    <Link to="/" className="text-primary font-bold hover:underline">
                        Browse Recipes to Add
                    </Link>
                </div>
            )}
        </div>
    );
};

export default CollectionDetails;
