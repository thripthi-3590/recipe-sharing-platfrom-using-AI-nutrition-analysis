import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { Trash2, Ban, CheckCircle, Search, User } from 'lucide-react';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchUsers = async () => {
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await api.delete(`/admin/users/${id}`);
                setUsers(users.filter(user => user._id !== id));
            } catch (error) {
                console.error("Error deleting user:", error);
                alert("Failed to delete user");
            }
        }
    };

    const handleToggleStatus = async (id) => {
        try {
            const { data } = await api.put(`/admin/users/${id}/status`);
            setUsers(users.map(user =>
                user._id === id ? { ...user, isBlocked: data.isBlocked } : user
            ));
        } catch (error) {
            console.error("Error updating user status:", error);
            alert("Failed to update user status");
        }
    };

    const filteredUsers = users.filter(user =>
        (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center text-gray-500">Loading users...</div>;

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900">Manage Users</h1>
                    <p className="text-gray-500">View and manage detailed information about registered users</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
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
                                <th className="p-4 font-semibold text-gray-600 text-sm">Role</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Status</th>
                                <th className="p-4 font-semibold text-gray-600 text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                                                {user.profilePicture ? (
                                                    <img src={user.profilePicture} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <User size={20} className="text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.username}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.role === 'admin'
                                            ? 'bg-purple-50 text-purple-600 border-purple-100'
                                            : 'bg-blue-50 text-blue-600 border-blue-100'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium flex items-center w-fit gap-1 ${user.isBlocked
                                            ? 'bg-red-50 text-red-600'
                                            : 'bg-green-50 text-green-600'
                                            }`}>
                                            {user.isBlocked ? (
                                                <><Ban size={12} /> Blocked</>
                                            ) : (
                                                <><CheckCircle size={12} /> Active</>
                                            )}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleToggleStatus(user._id)}
                                                className={`p-2 rounded-lg transition-colors ${user.isBlocked
                                                    ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                                    : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                                                    }`}
                                                title={user.isBlocked ? "Unblock User" : "Block User"}
                                            >
                                                {user.isBlocked ? <CheckCircle size={16} /> : <Ban size={16} />}
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user._id)}
                                                className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors"
                                                title="Delete User"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filteredUsers.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No users found matching your search.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
