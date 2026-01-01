import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [gradientIndex, setGradientIndex] = useState(0);
    const [loanCount, setLoanCount] = useState(0); // <--- NEW STATE FOR COUNTER
    const navigate = useNavigate();

    // Dynamic gradients
    const gradients = [
        "from-indigo-900 via-blue-900 to-purple-900",
        "from-blue-900 via-indigo-900 to-purple-900",
        "from-purple-900 via-blue-900 to-indigo-900",
        "from-blue-900 via-purple-900 to-indigo-900",
        "from-indigo-800 via-blue-800 to-purple-800",
        "from-purple-800 via-indigo-800 to-blue-800"
    ];

    useEffect(() => {
        // Change gradient every 5 seconds
        const interval = setInterval(() => {
            setGradientIndex((prev) => (prev + 1) % gradients.length);
        }, 5000);

        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");

                if (!token) {
                    navigate("/login");
                    return;
                }

                const config = {
                    headers: { Authorization: `Bearer ${token}` }
                };

                // 1. Fetch User Profile
                const userResponse = await axios.get("http://localhost:8080/api/users/me", config);
                setUser(userResponse.data);

                // 2. Fetch Active Loans to count them (<--- NEW LOGIC)
                const loansResponse = await axios.get("http://localhost:8080/api/loans/my-books", config);
                setLoanCount(loansResponse.data.length);

            } catch (error) {
                console.error("Error fetching profile data:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => clearInterval(interval);
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your account and view your reading activity</p>
                </div>

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-8 relative">
                    {/* Gradient Background */}
                    <div className={`h-40 bg-gradient-to-r ${gradients[gradientIndex]} transition-all duration-1000 ease-in-out`}></div>

                    {/* Avatar Container */}
                    <div className="relative px-8 pb-8">
                        <div className="absolute -top-20 left-8 transform -translate-y-0">
                            <div className="h-40 w-40 rounded-full border-8 border-white bg-gradient-to-br from-blue-100 to-purple-100 shadow-2xl flex items-center justify-center overflow-hidden">
                                <div className="h-full w-full flex items-center justify-center">
                                    <span className="text-6xl font-bold text-blue-600 uppercase">
                                        {user?.username?.charAt(0)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Info */}
                    <div className="px-8 pb-8 pt-24">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.username}</h1>
                                <div className="flex items-center text-gray-600 mb-4">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-lg">{user?.email}</p>
                                </div>
                            </div>

                            {/* Status Badges */}
                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Active Member
                                </span>
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200">
                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {user?.role}
                                </span>
                            </div>
                        </div>

                        {/* Member Since */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                <span className="font-medium">Member since:</span> {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats / Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Account Details Card */}
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <div className="mr-3 p-2 bg-blue-50 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                Account Details
                            </h2>
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                Edit Profile
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">User ID</p>
                                    <p className="font-medium text-gray-900">{user?.id}</p>
                                </div>
                                <span className="text-xs font-mono bg-gray-100 px-3 py-1 rounded-full text-gray-600">Unique</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">Username</p>
                                    <p className="font-medium text-gray-900">{user?.username}</p>
                                </div>
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-medium text-gray-900">{user?.email}</p>
                                </div>
                                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">Account Status</p>
                                    <p className="font-medium text-green-600">Verified & Active</p>
                                </div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Reading Stats Card */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <div className="mr-3 p-2 bg-purple-50 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            Reading Stats
                        </h2>

                        <div className="space-y-6">
                            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                                {/* FIXED: Now uses the real loanCount */}
                                <div className="text-4xl font-bold text-blue-600 mb-2">0</div>
                                <p className="text-sm text-blue-700 font-medium">Books Read</p>
                            </div>

                            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                                {/* FIXED: Now uses the real loanCount */}
                                <div className="text-4xl font-bold text-purple-600 mb-2">{loanCount}</div>
                                <p className="text-sm text-purple-700 font-medium">Current Loans</p>
                            </div>

                            <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">0</div>
                                <p className="text-sm text-indigo-700 font-medium">Books Saved</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/books')}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                                Explore Books
                            </span>
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 group">
                            <div className="flex items-center">
                                <div className="mr-3 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Change Password</p>
                                    <p className="text-sm text-gray-500">Update your security</p>
                                </div>
                            </div>
                        </button>

                        {/* Middle Button - Open My Library */}
                        <button
                            onClick={() => navigate('/my-books')}
                            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all duration-200 group relative overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center">
                                <div className="mr-3 p-2 bg-blue-600 text-white rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-blue-900">Open My Library</p>
                                    <p className="text-sm text-blue-700">Access your rented books</p>
                                </div>
                            </div>
                        </button>

                        <button className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 group">
                            <div className="flex items-center">
                                <div className="mr-3 p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-200">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">Support</p>
                                    <p className="text-sm text-gray-500">Get help & contact</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;