import { Link } from "react-router-dom";
import { Clock, Users, Flame, Heart } from "lucide-react";
import { useContext, useState, useEffect } from 'react';
import AuthContext from '../context/AuthContext';

const RecipeCard = ({ recipe }) => {
    const { user, toggleFavorite } = useContext(AuthContext);
    const isFavorite = user && user.favorites && user.favorites.some(id => id.toString() === recipe._id.toString());

    const handleToggleFavorite = async (e) => {
        e.preventDefault(); // Prevent link navigation
        e.stopPropagation(); // Stop event bubbling
        if (!user) {
            alert("Please log in to save recipes!");
            return;
        }
        await toggleFavorite(recipe._id);
    };

    return (
        <Link to={`/recipes/${recipe._id}`} className="group relative block h-full">
            <div className="bg-white dark:bg-gray-800 rounded-[1.5rem] shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:-translate-y-2 h-full flex flex-col group-hover:ring-4 group-hover:ring-primary/5 dark:group-hover:ring-primary/10">
                <div className="relative h-64 overflow-hidden">
                    {recipe.imageUrl ? (
                        <img
                            src={recipe.imageUrl}
                            alt={recipe.title}
                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-4xl filter grayscale group-hover:grayscale-0 transition-all duration-500">🥘</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="absolute top-4 left-4 z-20">
                        <span className="px-3 py-1.5 rounded-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-xs font-bold text-gray-800 dark:text-white shadow-[0_4px_10px_rgba(0,0,0,0.1)] flex items-center gap-1.5">
                            <Flame size={12} className="text-orange-500" />
                            {recipe.nutrition?.calories ? `${Math.round(recipe.nutrition.calories)} kcal` : 'Healthy'}
                        </span>
                    </div>

                    <button
                        onClick={handleToggleFavorite}
                        className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all duration-300 shadow-[0_4px_10px_rgba(0,0,0,0.1)] z-20 ${isFavorite ? 'bg-white dark:bg-gray-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 scale-110' : 'bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:text-red-500 hover:scale-110'}`}
                        title={isFavorite ? "Remove from Cookbook" : "Save to Cookbook"}
                    >
                        <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
                    </button>

                    <div className="absolute bottom-6 left-0 right-0 px-6 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100 z-20">
                        <span className="w-full flex items-center justify-center gap-2 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-bold text-sm rounded-xl shadow-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                            View Recipe
                        </span>
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-grow relative">
                    <div className="flex items-center justify-between mb-4 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                        <span className="bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded-md text-primary border border-gray-100 dark:border-gray-600">{recipe.category || 'Dinner'}</span>
                        <div className="flex items-center gap-1.5">
                            <Clock size={14} />
                            <span>{(recipe.prepTime || 0) + (recipe.cookTime || 0)} MIN</span>
                        </div>
                    </div>

                    <h3 className="font-hand text-2xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-primary transition-colors line-clamp-2">
                        {recipe.title}
                    </h3>

                    <div className="mt-auto pt-6 border-t border-dashed border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <Link
                            to={`/profile/${recipe.user?._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-3 group/author hover:opacity-100 transition-opacity"
                        >
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-300 border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden group-hover/author:border-primary/30 transition-colors">
                                {recipe.user?.profilePicture ? (
                                    <img src={recipe.user.profilePicture} alt="" className="w-full h-full object-cover" />
                                ) : (
                                    recipe.user?.username ? recipe.user.username.charAt(0).toUpperCase() : 'C'
                                )}
                            </div>
                            <div className="text-sm">
                                <span className="block text-gray-900 dark:text-white font-bold leading-none group-hover/author:text-primary transition-colors mb-0.5">@{recipe.user?.username || 'Chef'}</span>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider">Author</span>
                            </div>
                        </Link>
                        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500 text-sm font-medium bg-gray-50 dark:bg-gray-700/30 px-2.5 py-1 rounded-lg">
                            <Users size={14} />
                            <span>{recipe.servings || '2'}</span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default RecipeCard;
