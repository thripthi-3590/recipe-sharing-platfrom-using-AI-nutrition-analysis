import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { Calendar as CalendarIcon, Clock, Trash2, ChevronLeft, ChevronRight, Plus, Sun, Coffee, Home, Utensils } from "lucide-react";
import { Link } from "react-router-dom";
import ScheduleMealModal from "../components/ScheduleMealModal";
import DatePicker from "../components/DatePicker";
import WaterTracker from "../components/WaterTracker"; // Added
import NutritionHistoryChart from "../components/NutritionHistoryChart"; // Added
import NutritionGoals from '../components/NutritionGoals'; // Added
import NutritionProgress from '../components/NutritionProgress'; // Added

const MealPlanner = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
    const [currentStartDate, setCurrentStartDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [nutritionHistory, setNutritionHistory] = useState([]); // Added
    const [progress, setProgress] = useState(null); // Added
    const datePickerRef = useRef(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const [plansRes, historyRes, progressRes] = await Promise.all([
                    api.get('/meal-plans'),
                    api.get('/nutrition/history'), // Fetch history
                    api.get('/nutrition/progress') // Fetch progress
                ]);
                setPlans(plansRes.data);
                setNutritionHistory(historyRes.data);
                setProgress(progressRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
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

    const handleDelete = async (id) => {
        try {
            await api.delete(`/meal-plans/${id}`);
            setPlans(prev => prev.filter(p => p._id !== id));
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    const handleScheduleMeal = async (mealData) => {
        try {
            const { data } = await api.post('/meal-plans', {
                recipeId: mealData.recipeId,
                date: mealData.date,
                mealType: mealData.mealType
            });
            setPlans(prev => [...prev, data]);
        } catch (error) {
            console.error('Failed to schedule meal', error);
        }
    };

    const handleJumpToDate = (date) => {
        setCurrentStartDate(date);
        setIsDatePickerOpen(false);
    };

    const handleNextWeek = () => {
        const next = new Date(currentStartDate);
        next.setDate(next.getDate() + 7);
        setCurrentStartDate(next);
    };

    const handlePrevWeek = () => {
        const prev = new Date(currentStartDate);
        prev.setDate(prev.getDate() - 7);
        setCurrentStartDate(prev);
    };

    const goToToday = () => {
        setCurrentStartDate(new Date());
    };

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const now = new Date();
    const weekDates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(currentStartDate);
        d.setDate(currentStartDate.getDate() + i);
        return d;
    });

    const getMealTypeIcon = (type) => {
        switch (type?.toLowerCase()) {
            case 'breakfast': return <Coffee size={14} className="text-amber-500" />;
            case 'lunch': return <Sun size={14} className="text-blue-500" />;
            case 'dinner': return <Home size={14} className="text-indigo-500" />;
            default: return <Utensils size={14} className="text-primary" />;
        }
    };

    const handleGoalsUpdate = (newGoals) => {
        if (progress) {
            setProgress(prev => ({
                ...prev,
                goals: newGoals
            }));
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Consulting the culinary calendar...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <header className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                <div className="relative">
                    <h1 className="text-5xl font-serif font-black text-gray-900 dark:text-white mb-2 tracking-tight">Meal Planner</h1>
                    <button
                        onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                        className="text-gray-500 dark:text-gray-400 text-lg font-medium flex items-center gap-2 hover:text-primary transition-colors group"
                    >
                        <CalendarIcon size={20} className="text-primary group-hover:scale-110 transition-transform" />
                        {currentStartDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </button>

                    {isDatePickerOpen && (
                        <div ref={datePickerRef} className="absolute top-full left-0 mt-4 z-50">
                            <DatePicker
                                selectedDate={currentStartDate}
                                onSelect={handleJumpToDate}
                                onClose={() => setIsDatePickerOpen(false)}
                            />
                        </div>
                    )}
                </div>
                <div className="flex gap-4 items-center bg-white dark:bg-gray-800 p-2 rounded-[2rem] shadow-xl border border-gray-100 dark:border-gray-700 transition-colors">
                    <button
                        onClick={goToToday}
                        className="text-xs font-black uppercase tracking-widest text-primary px-6 py-3 hover:bg-primary/5 dark:hover:bg-primary/10 rounded-2xl transition-all"
                    >
                        Today
                    </button>
                    <div className="h-8 w-px bg-gray-100 dark:bg-gray-700"></div>
                    <button
                        onClick={handlePrevWeek}
                        className="p-3 rounded-2xl text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        <ChevronLeft size={24} />
                    </button>
                    <button
                        onClick={handleNextWeek}
                        className="p-3 rounded-2xl text-gray-400 dark:text-gray-500 hover:text-primary hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                    >
                        <ChevronRight size={24} />
                    </button>
                </div>
            </header>

            {/* Nutrition Dashboard Section */}
            <div className="space-y-8 mb-16">
                {/* Top Row: Goals and Progress */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <NutritionGoals
                        currentGoals={progress?.goals}
                        onUpdate={handleGoalsUpdate}
                    />
                    <NutritionProgress progress={progress} />
                </div>

                {/* Bottom Row: History and Water */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <NutritionHistoryChart history={nutritionHistory} />
                    </div>
                    <div>
                        <WaterTracker />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8">
                {weekDates.map((date, idx) => {
                    const dayPlans = plans.filter(p => new Date(p.date).toDateString() === date.toDateString());
                    const isToday = date.toDateString() === now.toDateString();

                    return (
                        <div key={idx} className="flex flex-col h-full min-h-[500px]">
                            <div className="text-center mb-8">
                                <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isToday ? 'text-primary' : 'text-gray-400 dark:text-gray-500'}`}>
                                    {days[date.getDay()]}
                                </p>
                                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-[2rem] text-2xl font-serif font-black transition-all ${isToday ? 'bg-primary text-white shadow-2xl shadow-primary/40 scale-110' : 'text-gray-900 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-50 dark:border-gray-700 shadow-sm'}`}>
                                    {date.getDate()}
                                </div>
                            </div>

                            <div className={`flex-grow bg-white dark:bg-gray-800 rounded-[2.5rem] p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-5 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col ${isToday ? 'ring-2 ring-primary/10 bg-gray-50/10 dark:bg-gray-700/20' : ''}`}>
                                {dayPlans.map(plan => (
                                    <div key={plan._id} className="relative group p-4 bg-white dark:bg-gray-700/50 rounded-2xl border border-gray-50 dark:border-gray-600 shadow-sm hover:shadow-lg hover:border-primary/20 transition-all duration-300">
                                        <button
                                            onClick={() => handleDelete(plan._id)}
                                            className="absolute -top-2 -right-2 p-2 bg-white dark:bg-gray-600 shadow-xl rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                        <div className="flex items-center gap-2 mb-2">
                                            {getMealTypeIcon(plan.mealType)}
                                            <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-400 tracking-widest">{plan.mealType}</p>
                                        </div>
                                        <Link to={`/recipes/${plan.recipe?._id}`} className="block font-bold text-gray-900 dark:text-white text-sm leading-tight hover:text-primary transition-colors line-clamp-2 mb-2">
                                            {plan.recipe?.title}
                                        </Link>
                                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-tighter">
                                            <Clock size={10} className="text-primary" /> {(plan.recipe?.prepTime || 0) + (plan.recipe?.cookTime || 0)}m Prep
                                        </div>
                                    </div>
                                ))}

                                <button
                                    onClick={() => {
                                        setSelectedDate(date);
                                        setIsModalOpen(true);
                                    }}
                                    className="mt-auto w-full py-6 border-2 border-dashed border-gray-100 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center text-gray-300 dark:text-gray-600 hover:border-primary/20 hover:text-primary hover:bg-primary/5 dark:hover:bg-primary/10 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-gray-700/50 flex items-center justify-center mb-2 group-hover:bg-primary/10 transition-colors">
                                        <Plus size={24} className="group-hover:scale-110 transition-transform" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-widest">Schedule</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <ScheduleMealModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                selectedDate={selectedDate}
                onSchedule={handleScheduleMeal}
            />
        </div>
    );
};

export default MealPlanner;
