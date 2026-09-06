import { useState, useContext } from "react";
import api from "../api/axios";
import { Sparkles, ArrowRight, Save, ChefHat, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import AuthContext from "../context/AuthContext";

const GenerateRecipe = () => {
    const [ingredients, setIngredients] = useState("");
    const [loading, setLoading] = useState(false);
    const [recipe, setRecipe] = useState(null);
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleGenerate = async (e) => {
        e.preventDefault();
        if (!ingredients.trim()) return;
        setLoading(true);
        try {
            const { data } = await api.post('/ai/generate', { ingredients });
            setRecipe(data);
        } catch (error) {
            console.error("AI Generation failed", error);
            const errorMsg = error.response?.data?.message || "The AI chef is having trouble connecting. Please check your API key.";
            alert(`Error: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user) {
            alert("Please log in to save recipes to your cookbook!");
            navigate('/login');
            return;
        }

        try {
            // Use existing nutrition if available from generation, else analyze
            let nutrition = recipe.nutrition;
            let aiSuggestions = recipe.aiSuggestions;

            if (!nutrition) {
                const aiRes = await api.post('/ai/analyze', { title: recipe.title, ingredients: recipe.ingredients });
                nutrition = aiRes.data.nutrition;
                aiSuggestions = aiRes.data.suggestions;
            }

            const toSave = { ...recipe, nutrition, aiSuggestions };
            const { data } = await api.post('/recipes', toSave);
            alert("Recipe saved successfully!");
            navigate(`/recipes/${data._id}`);
        } catch (error) {
            console.error("Save failed", error);
            const errorMsg = error.response?.data?.message || "Failed to save recipe.";
            alert(`Error: ${errorMsg}`);
        }
    };

    // Prepare chart data if nutrition exists
    const chartData = recipe?.nutrition ? [
        { name: 'Protein', value: recipe.nutrition.protein || 0, color: '#3B82F6' },
        { name: 'Carbs', value: recipe.nutrition.carbs || 0, color: '#F59E0B' },
        { name: 'Fats', value: recipe.nutrition.fats || 0, color: '#10B981' },
        { name: 'Fiber', value: recipe.nutrition.fiber || 0, color: '#8B5CF6' },
    ] : [];

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-4">
                    <Sparkles size={16} /> AI Culinary Assistant
                </div>
                <h1 className="text-5xl font-serif font-bold text-gray-900 dark:text-white mb-4">Kitchen Magician</h1>
                <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">Tell us what's in your pantry, and we'll summon a gourmet recipe in seconds.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-[40px] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden relative text-left transition-colors">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-primary-dark"></div>

                <div className="p-10 md:p-16">
                    <form onSubmit={handleGenerate} className="mb-10">
                        <label className="block text-sm font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4">Enter Recipe</label>
                        <div className="relative group">
                            <textarea
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                placeholder="Chicken, Mushrooms, Cream, Garlic..."
                                className="w-full p-8 bg-gray-50 dark:bg-gray-700/50 rounded-3xl text-xl font-medium outline-none focus:ring-4 focus:ring-primary/10 transition-all min-h-[160px] resize-none border border-transparent focus:border-primary/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            />
                            <button
                                type="submit"
                                disabled={loading || !ingredients.trim()}
                                className="absolute bottom-4 right-4 px-8 py-4 bg-gray-900 dark:bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary dark:hover:bg-primary-dark transition-all shadow-xl disabled:opacity-50"
                            >
                                {loading ? "Summoning..." : <>Generate <ArrowRight size={20} /></>}
                            </button>
                        </div>
                    </form>

                    {recipe && (
                        <div className="mt-16 animate-in slide-in-from-bottom-10 duration-700">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                        <ChefHat size={32} />
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-serif font-bold text-gray-900 dark:text-white">{recipe.title}</h2>
                                        <div className="flex gap-4 mt-1">
                                            <span className="text-sm font-bold text-primary">{recipe.difficulty}</span>
                                            <span className="text-sm font-bold text-gray-400">{recipe.prepTime + recipe.cookTime} mins</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={handleSave}
                                    className="px-8 py-4 bg-gradient-to-r from-primary to-primary-dark text-white rounded-2xl font-bold flex items-center gap-2 hover:shadow-2xl hover:shadow-primary/40 transition-all transform hover:-translate-y-1"
                                >
                                    <Save size={20} /> Save to Cookbook
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 gap-12 mb-12">
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-gray-200 mb-6 flex items-center gap-2">
                                        <Info size={20} className="text-primary" /> Ingredients
                                    </h3>
                                    <ul className="space-y-4">
                                        {recipe.ingredients.split('\n').map((item, i) => (
                                            item.trim() && (
                                                <li key={i} className="flex gap-3 text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2.5 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-gray-200 mb-6">Instructions</h3>
                                    <div className="space-y-6">
                                        {recipe.instructions.split('\n').map((step, i) => (
                                            step.trim() && (
                                                <div key={i} className="flex gap-4">
                                                    <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 text-xs font-black flex items-center justify-center flex-shrink-0 mt-1">
                                                        {(i + 1).toString().padStart(2, '0')}
                                                    </span>
                                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{step.replace(/^\d+\.\s*/, '')}</p>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Nutrition Section */}
                            {recipe.nutrition && (
                                <div className="border-t border-gray-100 dark:border-gray-700 pt-10 grid md:grid-cols-2 gap-12">
                                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-3xl p-8 transition-colors">
                                        <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Nutritional Breakdown</h3>
                                        <div className="h-64 w-full relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={chartData}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                        stroke="none"
                                                    >
                                                        {chartData.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-4xl font-black text-gray-800 dark:text-white tracking-tight">{Math.round(recipe.nutrition.calories)}</span>
                                                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Calories</span>
                                            </div>
                                        </div>
                                    </div>

                                    {recipe.aiSuggestions && (
                                        <div className="bg-green-50 dark:bg-green-900/20 rounded-3xl p-8 border border-green-100 dark:border-green-900/30">
                                            <h3 className="font-serif text-xl font-bold text-green-800 dark:text-green-300 mb-6 flex items-center gap-2">
                                                <Sparkles size={20} /> AI Health Tips
                                            </h3>
                                            <ul className="space-y-4">
                                                {recipe.aiSuggestions.map((tip, idx) => (
                                                    <li key={idx} className="flex gap-3 text-green-700 dark:text-green-400 font-medium leading-relaxed">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2.5 flex-shrink-0" />
                                                        {tip}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GenerateRecipe;
