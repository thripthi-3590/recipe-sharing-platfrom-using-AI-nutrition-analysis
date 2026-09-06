import { useState, useEffect } from 'react';
import api from '../../api/axios';
import {
    Users, Utensils, MessageSquare, Heart, TrendingUp,
    PlusCircle, Activity, UserPlus, Zap, ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-xl transition-all duration-500 group">
        <div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-2">{title}</p>
            <h3 className="text-4xl font-serif font-black text-gray-900 group-hover:text-primary transition-colors">{value}</h3>
        </div>
        <div className={`p-5 rounded-3xl ${color} shadow-lg shadow-current/20 transform group-hover:rotate-12 transition-transform`}>
            <Icon size={28} className="text-white" />
        </div>
    </div>
);

const QuickAction = ({ title, icon: Icon, to, color }) => (
    <Link to={to} className="flex flex-col items-center gap-4 p-8 bg-white border border-gray-100 rounded-[2.5rem] hover:shadow-2xl hover:shadow-primary/5 transition-all group overflow-hidden relative">
        <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-150`}></div>
        <div className={`w-16 h-16 rounded-2xl ${color.replace('bg-', 'bg-')}/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform`}>
            <Icon size={32} />
        </div>
        <span className="text-sm font-black text-gray-900 uppercase tracking-widest">{title}</span>
    </Link>
);

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        users: 0,
        recipes: 0,
        comments: 0,
        likes: 0,
        recentUsers: [],
        recentRecipes: [],
        recentComments: [],
        categoryDistribution: []
    });
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('users');

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const { data } = await api.get('/admin/stats');
                setStats(data);
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="h-[60vh] flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-gray-400 font-black uppercase tracking-widest text-xs animate-pulse">Syncing Command Center...</p>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-1 bg-primary rounded-full"></div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Command</span>
                    </div>
                    <h1 className="text-5xl font-serif font-black text-gray-900 tracking-tight leading-none">Command Center</h1>
                </div>
                <div className="flex gap-4">
                    <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-bold text-gray-600 uppercase tracking-widest">Live: Platform Active</span>
                    </div>
                </div>
            </header>

            {/* Core Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <StatCard title="Total Users" value={stats.users} icon={Users} color="bg-blue-600" />
                <StatCard title="Total Recipes" value={stats.recipes} icon={Utensils} color="bg-orange-500" />
                <StatCard title="Total Comments" value={stats.comments} icon={MessageSquare} color="bg-green-600" />
                <StatCard title="Total Likes" value={stats.likes} icon={Heart} color="bg-pink-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                {/* Left: Quick Actions & Intelligence */}
                <div className="lg:col-span-4 space-y-12">
                    <section>
                        <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-[0.15em] flex items-center gap-3">
                            <Zap size={20} className="text-primary" /> Core Actions
                        </h2>
                        <div className="grid grid-cols-2 gap-6">
                            <QuickAction title="New Recipe" icon={PlusCircle} to="/create-recipe" color="bg-orange-500" />
                            <QuickAction title="Curate Chefs" icon={Users} to="/admin/users" color="bg-blue-600" />
                            <QuickAction title="Watch Feed" icon={Activity} to="/feed" color="bg-primary" />
                            <QuickAction title="Review Talk" icon={MessageSquare} to="/admin/comments" color="bg-green-600" />
                        </div>
                    </section>

                    <section className="bg-gray-900 rounded-[3rem] p-10 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-150 duration-700"></div>
                        <div className="relative z-10">
                            <TrendingUp size={48} className="text-primary mb-6" />
                            <h3 className="text-2xl font-serif font-black mb-4 tracking-tight leading-snug">Intelligence Summary</h3>
                            <p className="text-white/50 text-sm font-medium leading-relaxed mb-8">
                                Top category this week: <span className="text-white font-bold">{stats.categoryDistribution.sort((a, b) => b.count - a.count)[0]?._id || 'N/A'}</span>. User engagement is up 12%.
                            </p>
                        </div>
                    </section>
                </div>

                {/* Right: Activity Hub */}
                <div className="lg:col-span-8 bg-white rounded-[3rem] border border-gray-100 shadow-sm flex flex-col">
                    <div className="p-10 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                                <Activity size={24} />
                            </div>
                            <h2 className="text-2xl font-serif font-black text-gray-900 tracking-tight">Activity Hub</h2>
                        </div>
                        <div className="flex bg-gray-50 p-1.5 rounded-2xl">
                            {['users', 'recipes', 'comments'].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab
                                            ? 'bg-white text-gray-900 shadow-md transform -translate-y-0.5'
                                            : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-6 md:p-10">
                        {activeTab === 'users' && (
                            <div className="space-y-4">
                                {stats.recentUsers.map(u => (
                                    <div key={u._id} className="group p-6 hover:bg-gray-50 rounded-3xl transition-all border border-transparent hover:border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg">
                                                {u.username.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 group-hover:text-primary transition-colors">{u.username}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{u.email}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] text-gray-400 font-black tracking-widest uppercase">Joined</p>
                                            <p className="text-sm font-bold text-gray-900">{new Date(u.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'recipes' && (
                            <div className="space-y-4">
                                {stats.recentRecipes.map(r => (
                                    <div key={r._id} className="group p-6 hover:bg-gray-50 rounded-3xl transition-all border border-transparent hover:border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-5">
                                            <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                                                <Utensils size={24} />
                                            </div>
                                            <div>
                                                <p className="font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1">{r.title}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">by @{r.user?.username || 'Unknown'}</p>
                                            </div>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </div>
                                ))}
                            </div>
                        )}
                        {activeTab === 'comments' && (
                            <div className="space-y-4">
                                {stats.recentComments.map(c => (
                                    <div key={c._id} className="group p-6 hover:bg-gray-50 rounded-3xl transition-all border border-transparent hover:border-gray-100">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-[10px] items-center gap-2 flex font-black uppercase tracking-widest text-primary">
                                                <UserPlus size={12} /> {c.user?.username} <span className="text-gray-300">on</span> {c.recipe?.title}
                                            </p>
                                            <span className="text-[10px] font-bold text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-gray-600 text-sm font-medium line-clamp-2 leading-relaxed">"{c.content}"</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link to="/admin/users" className="mt-auto p-10 bg-gray-50/50 hover:bg-gray-50 transition-colors text-center border-t border-gray-50 group">
                        <span className="text-sm font-black text-gray-900 uppercase tracking-[0.2em] group-hover:text-primary transition-colors">Launch Deep Dive Analysis</span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
