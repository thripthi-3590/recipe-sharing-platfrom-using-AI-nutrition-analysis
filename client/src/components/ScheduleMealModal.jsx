import { useState, useEffect, useRef } from 'react';
import { X, Clock, Utensils, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import api from '../api/axios';
import DatePicker from './DatePicker';

const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

const ScheduleMealModal = ({ isOpen, onClose, selectedDate, onSchedule }) => {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRecipe, setSelectedRecipe] = useState('');
    const [mealType, setMealType] = useState('Breakfast');
    const [searchTerm, setSearchTerm] = useState('');
    const [localDate, setLocalDate] = useState(new Date());
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const datePickerRef = useRef(null);

    useEffect(() => {
        if (selectedDate) {
            setLocalDate(new Date(selectedDate));
        }
    }, [selectedDate, isOpen]);

    useEffect(() => {
        const fetchRecipes = async () => {
            try {
                const { data } = await api.get('/recipes');
                setRecipes(data);
            } catch (error) {
                console.error('Failed to fetch recipes', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecipes();
    }, []);

    // Close date picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
                setIsDatePickerOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedRecipe) return;

        try {
            await onSchedule({
                recipeId: selectedRecipe,
                date: localDate,
                mealType
            });
            onClose();
        } catch (error) {
            console.error('Failed to schedule meal', error);
        }
    };

    const handleDateSelect = (date) => {
        setLocalDate(date);
        setIsDatePickerOpen(false);
    };

    const filteredRecipes = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl border border-white/20 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
                    <div>
                        <h3 className="text-2xl font-serif font-black text-gray-900 leading-none mb-2">Schedule A Meal</h3>
                        <p className="text-xs font-black uppercase text-gray-400 tracking-widest">Plan your culinary week</p>
                    </div>
                    <button onClick={onClose} className="p-3 hover:bg-white rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-8 overflow-y-auto space-y-8">
                    <div className="relative">
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Target Date</label>
                        <button
                            type="button"
                            onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                            className="w-full p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between group hover:border-primary/20 transition-all"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white rounded-2xl shadow-sm text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                    <CalendarIcon size={20} />
                                </div>
                                <span className="text-lg font-bold text-gray-900">
                                    {localDate.toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'long',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </span>
                            </div>
                            <ChevronDown size={20} className={`text-gray-400 transition-transform duration-300 ${isDatePickerOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDatePickerOpen && (
                            <div ref={datePickerRef} className="absolute top-full left-0 mt-4 z-50">
                                <DatePicker
                                    selectedDate={localDate}
                                    onSelect={handleDateSelect}
                                    onClose={() => setIsDatePickerOpen(false)}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Meal Type</label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {mealTypes.map(type => (
                                <button
                                    key={type}
                                    type="button"
                                    onClick={() => setMealType(type)}
                                    className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all font-bold text-xs uppercase tracking-widest ${mealType === type
                                            ? 'border-primary bg-primary/5 text-primary shadow-lg shadow-primary/10 scale-105'
                                            : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200 hover:bg-white'
                                        }`}
                                >
                                    <Utensils size={18} />
                                    <span>{type}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Choice of Recipe</label>
                        <input
                            type="text"
                            placeholder="Search your cookbook..."
                            className="w-full p-6 bg-gray-50 border border-gray-100 rounded-3xl text-lg font-medium outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all mb-6"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className="space-y-3 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
                            {loading ? (
                                <div className="flex flex-col items-center py-10">
                                    <div className="w-8 h-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin mb-3" />
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Browsing Masterpieces...</p>
                                </div>
                            ) : filteredRecipes.length > 0 ? (
                                filteredRecipes.map(recipe => (
                                    <div
                                        key={recipe._id}
                                        onClick={() => setSelectedRecipe(recipe._id)}
                                        className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${selectedRecipe === recipe._id
                                                ? 'border-primary bg-primary/5 shadow-md scale-[1.02]'
                                                : 'border-gray-50 hover:border-gray-200 group'
                                            }`}
                                    >
                                        <h4 className={`font-black tracking-tight transition-colors ${selectedRecipe === recipe._id ? 'text-primary' : 'text-gray-900 group-hover:text-primary'}`}>
                                            {recipe.title}
                                        </h4>
                                        <div className="flex items-center gap-4 text-[10px] text-gray-400 font-black uppercase tracking-widest mt-2">
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={12} className="text-primary" />
                                                {recipe.prepTime + recipe.cookTime}min
                                            </div>
                                            <div className="flex items-center gap-1.5 text-orange-500">
                                                <Utensils size={12} />
                                                {recipe.servings} Servings
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                        No matches found.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-gray-50 flex justify-end gap-4 bg-gray-50/30">
                    <button
                        onClick={onClose}
                        className="px-8 py-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!selectedRecipe}
                        className={`px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl ${selectedRecipe
                                ? 'bg-primary text-white shadow-primary/30 hover:-translate-y-1 active:translate-y-0'
                                : 'bg-gray-100 text-gray-300 cursor-not-allowed shadow-none'
                            }`}
                    >
                        Commit to Meal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScheduleMealModal;
