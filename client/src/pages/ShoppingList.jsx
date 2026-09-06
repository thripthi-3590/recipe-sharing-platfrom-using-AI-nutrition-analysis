import { useEffect, useState } from "react";
import api from "../api/axios";
import { ShoppingCart, Trash2, Plus, CheckSquare, Square, XCircle } from "lucide-react";
import { toast } from 'react-toastify';

const ShoppingList = () => {
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [addingItem, setAddingItem] = useState(false);
    const [newItem, setNewItem] = useState("");
    const [error, setError] = useState(null);

    const fetchList = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await api.get('/users/shopping-list');
            setList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to fetch shopping list", error);
            setError('Failed to load shopping list. Please try again.');
            toast.error('Failed to load shopping list');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchList();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAction = async (items, action) => {
        try {
            console.log('Sending request to /users/shopping-list with:', { items, action });
            const response = await api.put('/users/shopping-list', { items, action });
            console.log('Response from server:', response);
            if (response && response.data) {
                setList(Array.isArray(response.data) ? response.data : []);
                return true;
            } else {
                console.error('Unexpected response format:', response);
                toast.error(`Unexpected response from server`);
                return false;
            }
        } catch (error) {
            console.error("Action failed:", error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to update shopping list';
            console.error('Error details:', error.response?.data || error);
            toast.error(errorMessage);
            return false;
        }
    };

    const addItem = async (e) => {
        e.preventDefault();
        const itemToAdd = newItem.trim();
        if (!itemToAdd) return;

        setAddingItem(true);
        try {
            const success = await handleAction([itemToAdd], 'add');
            if (success) {
                setNewItem("");
                await fetchList();
                toast.success('Item added to list');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            toast.error('Failed to add item');
        } finally {
            setAddingItem(false);
        }
    };

    const toggleItem = async (itemName) => {
        await handleAction([itemName], 'toggle');
    };

    const clearChecked = async () => {
        await handleAction([], 'clearChecked');
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Gathering your list...</p>
            </div>
        );
    }

    const checkedCount = list.filter(i => i.checked).length;

    return (
        <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6">
            <header className="flex items-center justify-between mb-12">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-2">Shopping List</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">Everything you need for your next masterpiece.</p>
                </div>
                <div className="w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2.5rem] flex items-center justify-center text-primary shadow-inner border border-white/50 dark:border-gray-700 backdrop-blur-sm">
                    <ShoppingCart size={36} className="drop-shadow-sm" />
                </div>
            </header>

            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden group transition-colors">
                {/* Input Section */}
                <form onSubmit={addItem} className="p-8 border-b border-gray-100 dark:border-gray-700 flex gap-4 bg-gray-50/50 dark:bg-gray-700/30 transition-colors">
                    <div className="relative flex-grow">
                        <input
                            type="text"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Add item (e.g. 2kg Fuji Apples)"
                            className="w-full p-5 bg-white dark:bg-gray-700 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium text-lg border border-transparent focus:border-primary/20 placeholder-gray-400 dark:text-white dark:placeholder-gray-500"
                        />
                    </div>
                    <button className="px-10 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-primary-dark transition-all shadow-xl hover:-translate-y-1 active:translate-y-0">
                        <Plus size={24} /> Add
                    </button>
                </form>

                {/* List Items */}
                <div className="divide-y divide-gray-50 dark:divide-gray-700">
                    {list.length > 0 ? (
                        list.map((item, idx) => (
                            <div key={idx} className="p-6 flex items-center justify-between group/item hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors">
                                <div className="flex items-center gap-5 flex-grow">
                                    <button
                                        onClick={() => toggleItem(item.item)}
                                        className={`transition-all duration-300 transform hover:scale-110 ${item.checked ? 'text-green-500' : 'text-gray-300 dark:text-gray-500 hover:text-primary'}`}
                                    >
                                        {item.checked ? <CheckSquare size={28} /> : <Square size={28} />}
                                    </button>
                                    <span className={`text-xl font-medium transition-all ${item.checked ? 'text-gray-400 dark:text-gray-600 line-through decoration-2' : 'text-gray-700 dark:text-gray-300'}`}>
                                        {item.item}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleAction([item.item], 'remove')}
                                    className="p-3 text-gray-300 dark:text-gray-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all opacity-0 group-hover/item:opacity-100"
                                >
                                    <Trash2 size={22} />
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="py-32 text-center flex flex-col items-center px-6">
                            <div className="w-24 h-24 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center text-gray-200 dark:text-gray-600 mb-8 border border-gray-50 dark:border-gray-700">
                                <XCircle size={48} />
                            </div>
                            <h2 className="text-2xl font-serif text-gray-900 dark:text-white font-bold mb-2">Empty Pantry?</h2>
                            <p className="text-gray-400 dark:text-gray-500 text-lg italic max-w-xs mx-auto">Add ingredients manually or from recipe pages to get started.</p>
                        </div>
                    )}
                </div>

                {/* Footer Controls */}
                {list.length > 0 && (
                    <div className="p-8 bg-gray-50/50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center transition-colors">
                        <div className="flex items-center gap-4">
                            <span className="px-4 py-1.5 bg-white dark:bg-gray-700 rounded-full text-sm font-bold text-gray-500 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-gray-600 uppercase tracking-widest">
                                {list.length} {list.length === 1 ? 'Item' : 'Items'}
                            </span>
                            {checkedCount > 0 && (
                                <button
                                    onClick={clearChecked}
                                    className="text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-1.5 rounded-full transition-colors flex items-center gap-2"
                                >
                                    <Trash2 size={14} /> Clear {checkedCount} Completed
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => handleAction(list.map(i => i.item), 'remove')}
                            className="text-sm font-bold text-gray-400 dark:text-gray-500 hover:text-red-600 transition-colors uppercase tracking-widest hover:underline"
                        >
                            Clear All
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ShoppingList;
