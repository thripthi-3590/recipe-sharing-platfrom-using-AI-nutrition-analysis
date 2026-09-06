import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Trash2, Search, ExternalLink, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

const ManageComments = () => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchComments = async () => {
        try {
            const { data } = await api.get('/admin/comments');
            setComments(data);
        } catch (error) {
            console.error("Error fetching comments:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            try {
                await api.delete(`/admin/comments/${id}`);
                setComments(comments.filter(comment => comment._id !== id));
            } catch (error) {
                console.error("Error deleting comment:", error);
                alert("Failed to delete comment");
            }
        }
    };

    const filteredComments = comments.filter(comment =>
        (comment.text?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (comment.user?.username?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading comments...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Manage Comments</h1>
                    <p className="text-gray-500">Moderate user discussion and feedback</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search comments..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-full md:w-64"
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="p-4 font-semibold text-gray-600 text-sm">User</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Comment</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Recipe</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm w-24">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredComments.map((comment) => (
                                <tr key={comment._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4 min-w-[150px]">
                                        <div className="font-medium text-gray-900">@{comment.user?.username || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500">{new Date(comment.createdAt).toLocaleDateString()}</div>
                                    </td>
                                    <td className="p-4 max-w-md">
                                        <p className="text-gray-700 line-clamp-2">{comment.text}</p>
                                    </td>
                                    <td className="p-4 min-w-[150px]">
                                        {comment.recipe ? (
                                            <Link to={`/recipes/${comment.recipe._id}`} className="text-primary hover:underline flex items-center gap-1">
                                                <span>{comment.recipe.title}</span>
                                                <ExternalLink size={12} />
                                            </Link>
                                        ) : (
                                            <span className="text-gray-400 italic">Deleted Recipe</span>
                                        )}
                                    </td>
                                    <td className="p-4">
                                        <button
                                            onClick={() => handleDelete(comment._id)}
                                            className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                            title="Delete Comment"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredComments.length === 0 && (
                    <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                        <MessageSquare size={48} className="text-gray-300 mb-4" />
                        <p>No comments found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageComments;
