import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // Fetch users from the new endpoint
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/api/admin/users", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Error fetching users:", error);
            alert("Could not load users. You might not have admin privileges.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Delete user function
    const handleDeleteUser = async (userId) => {
        if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
            return;
        }

        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            await axios.delete(`http://localhost:8080/api/admin/users/${userId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Remove user from local state
            setUsers(users.filter(user => user.id !== userId));
            alert("User deleted successfully.");
        } catch (error) {
            console.error("Error deleting user:", error);
            alert("Failed to delete user.");
        }
    };

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Format date
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
                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Manage Users</h1>
                        <p className="text-gray-600 mt-2">View and manage all registered users</p>
                    </div>
                    <Link
                        to="/admin/dashboard"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users by name, email, or role..."
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

                {/* Users Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    {loading ? (
                        <div className="p-10 text-center">
                            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            <p className="text-gray-500 mt-4">Loading users...</p>
                        </div>
                    ) : (
                        <>
                            {/* Stats Summary */}
                            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing <span className="font-semibold">{filteredUsers.length}</span> user{filteredUsers.length !== 1 ? 's' : ''}
                                </div>
                                <div className="text-sm text-gray-600">
                                    Total Registered: <span className="font-semibold">{users.length}</span>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
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
                                                        <div className="text-sm text-gray-500">ID: {user.id}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${user.role === 'ADMIN' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                                        {user.role === 'ADMIN' ? (
                                                            <>
                                                                <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                </svg>
                                                                Admin
                                                            </>
                                                        ) : 'User'}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-gray-600">
                                                <div className="flex items-center">
                                                    <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        disabled={user.role === 'ADMIN'} // Prevent deleting admins
                                                        className={`px-3 py-1 text-sm rounded-lg transition-colors ${user.role === 'ADMIN'
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'}`}
                                                        title={user.role === 'ADMIN' ? "Cannot delete admin users" : "Delete user"}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}

                                    {filteredUsers.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center">
                                                <div className="text-gray-500">
                                                    <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                    </svg>
                                                    <p className="mt-2 text-lg font-medium">No users found</p>
                                                    <p className="mt-1">Try adjusting your search terms</p>
                                                </div>
                                            </td>
                                        </tr>
                                    )}
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