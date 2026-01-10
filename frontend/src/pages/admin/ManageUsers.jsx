import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const ManageUsers = () => {
    const { t } = useTranslation();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const response = await axios.get("http://library-backend.onrender.com/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            alert(t('admin.users_fetch_error', 'Could not load users. You might not have admin privileges.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm(t('admin.confirm_delete_user', 'Are you sure you want to delete this user? This action cannot be undone.'))) {
            return;
        }

        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            await axios.delete(`http://library-backend.onrender.com/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUsers(users.filter(user => user.id !== userId));
            alert(t('admin.user_deleted', 'User deleted successfully.'));
        } catch (error) {
            console.error("Error deleting user:", error);
            alert(t('admin.user_delete_failed', 'Failed to delete user.'));
        }
    };

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">{t('admin.users_title', 'Manage Users')}</h1>
                        <p className="text-gray-600 mt-2">{t('admin.users_subtitle', 'View and manage all registered users')}</p>
                    </div>
                    <Link
                        to="/admin/dashboard"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        ← {t('admin.back_to_dashboard', 'Back to Dashboard')}
                    </Link>
                </div>

                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder={t('admin.search_users', 'Search users by name, email, or role...')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                        <div className="absolute left-4 top-3.5 text-gray-400">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    {loading ? (
                        <div className="p-10 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-gray-500 mt-4">{t('admin.loading_users', 'Loading users...')}</p>
                        </div>
                    ) : (
                        <>
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    {t('admin.showing_users', 'Showing')} <span className="font-semibold">{filteredUsers.length}</span> {t('admin.user_count', 'user(s)')}
                                </div>
                                <div className="text-sm text-gray-600">
                                    {t('admin.total_registered', 'Total Registered')}: <span className="font-semibold">{users.length}</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.user_table_user', 'User')}</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.user_table_role', 'Role')}</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.user_table_email', 'Email')}</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.user_table_joined', 'Joined')}</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.table_actions', 'Actions')}</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                                                        {user.username.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="font-semibold text-gray-900">{user.username}</div>
                                                        <div className="text-sm text-gray-500">{t('admin.user_id', 'ID')}: {user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {user.role === 'ADMIN' ? t('admin.role_admin', 'Admin') : t('admin.role_user', 'User')}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                {user.email}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(user.createdAt || user.created_at)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    disabled={user.role === 'ADMIN'}
                                                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${user.role === 'ADMIN'
                                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                        : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'}`}
                                                >
                                                    {t('admin.btn_delete', 'Delete')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUsers;