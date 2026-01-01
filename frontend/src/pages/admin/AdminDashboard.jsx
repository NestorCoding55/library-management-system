import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalBooks: 0, totalUsers: 0, activeLoans: 0 });
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch stats from our backend endpoint
        const fetchStats = async () => {
            try {
                // Get token from EITHER storage
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");

                const response = await axios.get("http://localhost:8080/api/admin/stats", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching admin stats", error);
                // Optional: Redirect to login if unauthorized
            }
        };

        fetchStats();
    }, []);

    const StatCard = ({ title, value, color, icon }) => (
        <div className={`bg-white p-6 rounded-2xl shadow-lg border-l-4 ${color} transform hover:-translate-y-1 transition-transform duration-300`}>
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-gray-500 text-sm font-semibold uppercase">{title}</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-1">{value}</h3>
                </div>
                <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('500', '100')}`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <StatCard
                        title="Total Books"
                        value={stats.totalBooks}
                        color="border-blue-500"
                        icon={<svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>}
                    />
                    <StatCard
                        title="Total Users"
                        value={stats.totalUsers}
                        color="border-green-500"
                        icon={<svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                    />
                    <StatCard
                        title="Active Loans"
                        value={stats.activeLoans}
                        color="border-purple-500"
                        icon={<svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                    />
                </div>

                {/* Quick Actions */}
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Add Books Action */}
                    <Link to="/admin/books" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center space-x-4 cursor-pointer">
                        <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-600 transition-colors duration-300">
                            <svg className="w-8 h-8 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-blue-600">Add New Book</h3>
                            <p className="text-gray-500 text-sm">Register new inventory</p>
                        </div>
                    </Link>

                    {/* Manage Books Action */}
                    <Link to="/admin/books" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center space-x-4 cursor-pointer">
                        <div className="bg-indigo-100 p-4 rounded-full group-hover:bg-indigo-600 transition-colors duration-300">
                            <svg className="w-8 h-8 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600">Manage Books</h3>
                            <p className="text-gray-500 text-sm">Edit or delete existing books</p>
                        </div>
                    </Link>

                    {/* Manage Users Action */}
                    <Link to="/admin/users" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center space-x-4 cursor-pointer">
                        <div className="bg-green-100 p-4 rounded-full group-hover:bg-green-600 transition-colors duration-300">
                            <svg className="w-8 h-8 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8.5a6 6 0 01-6 6" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600">Manage Users</h3>
                            <p className="text-gray-500 text-sm">View and manage all users</p>
                        </div>
                    </Link>

                    {/* --- NEW: Active Loans Action --- */}
                    <Link to="/admin/loans" className="group bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 flex items-center space-x-4 cursor-pointer">
                        <div className="bg-purple-100 p-4 rounded-full group-hover:bg-purple-600 transition-colors duration-300">
                            <svg className="w-8 h-8 text-purple-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-600">Active Loans</h3>
                            <p className="text-gray-500 text-sm">Monitor rentals & revenue</p>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;