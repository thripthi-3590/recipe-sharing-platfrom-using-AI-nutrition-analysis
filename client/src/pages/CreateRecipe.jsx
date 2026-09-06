import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { Sparkles, Upload, Image as ImageIcon, X } from "lucide-react";

const CreateRecipe = () => {
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [instructions, setInstructions] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [category, setCategory] = useState("Dinner");
    const [difficulty, setDifficulty] = useState("Easy");
    const [prepTime, setPrepTime] = useState(0);
    const [cookTime, setCookTime] = useState(0);
    const navigate = useNavigate();

    const handleAnalyze = async (e) => {
        e.preventDefault();
        if (!title || !ingredients) return;

        setAnalyzing(true);
        try {
            // Optionally pre-analyze
            await new Promise(r => setTimeout(r, 1000)); // UI effect
        } finally {
            setAnalyzing(false);
        }
    };
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setImage(null);
        setPreview("");
    };

    const uploadFileHandler = async () => {
        const formData = new FormData();
        formData.append('image', image);
        try {
            setUploading(true);
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };
            const { data } = await api.post('/upload', formData, config);
            return data; // This should be the image path
        } catch (error) {
            console.error(error);
            setUploading(false);
            return null;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // We submit to the API, which will trigger the AI analysis internally or we can do it separately.
            // For this flow, we'll send it all to the create endpoint which handles it.

            // Call AI first to get nutrition data (simulated flow for better UX)
            const aiResponse = await api.post('/ai/analyze', { title, ingredients });

            // Upload image if selected
            let imageUrl = "";
            if (image) {
                const uploadedPath = await uploadFileHandler();
                if (uploadedPath) {
                    // Backend returns relative path like '/uploads/file.jpg'
                    // We need to prepend the server URL if it's not relative to domain root,
                    // but usually keeping it relative in DB is best.
                    // However, for display we might need full URL if served from different port etc,
                    // but here we serve static from same server port.
                    // We need to ensure the path is correct.
                    // api.defaults.baseURL is likely http://localhost:5000/api
                    // Our static folder is at http://localhost:5000/uploads
                    // The return is /uploads/file.jpg
                    // So full URL is http://localhost:5000 + /uploads/file.jpg
                    imageUrl = `http://localhost:5000${uploadedPath}`;
                }
            }

            const recipeData = {
                title,
                ingredients,
                instructions,
                imageUrl,
                category,
                difficulty,
                prepTime,
                cookTime,
                nutrition: aiResponse.data.nutrition,
                aiSuggestions: aiResponse.data.suggestions
            };

            await api.post("/recipes", recipeData);
            navigate("/");
        } catch (error) {
            console.error("Failed to create recipe", error);
            alert("Failed to create recipe. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-serif font-bold text-gray-900 mb-2">Share Your Creation</h1>
                <p className="text-gray-500">Let the community hunger for your masterpiece.</p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 md:p-12 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-accent"></div>
                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* Image Upload Area */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Recipe Image</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-white transition-colors relative">
                            {preview ? (
                                <div className="relative w-full h-64 rounded-lg overflow-hidden group">
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full text-red-500 hover:bg-white hover:text-red-700 transition-colors shadow-sm"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                        <ImageIcon size={32} />
                                    </div>
                                    <div className="flex text-sm text-gray-600 justify-center">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                                        >
                                            <span>Upload a file</span>
                                            <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                        </label>
                                        <p className="pl-1">or drag and drop</p>
                                    </div>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Recipe Title</label>
                        <input
                            type="text"
                            className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium text-lg"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="e.g. Grandma's Legendary Apple Pie"
                            required
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Category</label>
                            <select
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option>Breakfast</option>
                                <option>Lunch</option>
                                <option>Dinner</option>
                                <option>Dessert</option>
                                <option>Snack</option>
                                <option>Baking</option>
                                <option>Smoothie</option>
                                <option>Appetizer</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Difficulty</label>
                            <select
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                value={difficulty}
                                onChange={(e) => setDifficulty(e.target.value)}
                            >
                                <option>Easy</option>
                                <option>Medium</option>
                                <option>Hard</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Prep Time (mins)</label>
                            <input
                                type="number"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                value={prepTime}
                                onChange={(e) => setPrepTime(e.target.value)}
                                min="0"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Cook Time (mins)</label>
                            <input
                                type="number"
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-medium"
                                value={cookTime}
                                onChange={(e) => setCookTime(e.target.value)}
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Ingredients</label>
                            <textarea
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[200px] font-mono text-sm leading-relaxed"
                                value={ingredients}
                                onChange={(e) => setIngredients(e.target.value)}
                                placeholder={"2 cups flour\n1 cup sugar\n3 eggs..."}
                                required
                            />
                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                                <Sparkles size={12} /> One ingredient per line results in better AI analysis.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Instructions</label>
                            <textarea
                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[200px] leading-relaxed"
                                value={instructions}
                                onChange={(e) => setInstructions(e.target.value)}
                                placeholder="1. Preheat the oven to 350°F..."
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex items-center justify-end gap-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-6 py-3 rounded-xl font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <>Processing...</>
                            ) : (
                                <><Sparkles size={18} /> Analyze & Publish Recipe</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRecipe;
