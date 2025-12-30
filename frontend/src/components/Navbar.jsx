import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navbar = () => {
    const navigate = useNavigate();
    const [gradientIndex, setGradientIndex] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        role: '',
        username: ''
    });

    // Dynamic gradients (same as login page)
    const gradients = [
        "from-indigo-900 via-blue-900 to-purple-900",
        "from-blue-900 via-indigo-900 to-purple-900",
        "from-purple-900 via-blue-900 to-indigo-900",
        "from-blue-900 via-purple-900 to-indigo-900",
        "from-indigo-800 via-blue-800 to-purple-800",
        "from-purple-800 via-indigo-800 to-blue-800"
    ];

    // Change gradient every 5 seconds and check auth state
    useEffect(() => {
        const interval = setInterval(() => {
            setGradientIndex((prev) => (prev + 1) % gradients.length);
        }, 5000);

        // Check auth state from both localStorage and sessionStorage
        const checkAuthState = () => {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const role = localStorage.getItem("role") || sessionStorage.getItem("role");
            const username = localStorage.getItem("username") || sessionStorage.getItem("username");

            setAuthState({
                isLoggedIn: !!token,
                role: role || '',
                username: username || ''
            });
        };

        checkAuthState();

        // Listen for storage changes (for when login/logout happens in another tab)
        window.addEventListener('storage', checkAuthState);

        return () => {
            clearInterval(interval);
            window.removeEventListener('storage', checkAuthState);
        };
    }, []);

    // Logout Logic
    const handleLogout = () => {
        // Clear all auth-related data from BOTH storages
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("username");

        navigate("/login");
        window.location.reload();
    };

    return (
        <nav className={`bg-gradient-to-br ${gradients[gradientIndex]} text-white shadow-2xl transition-all duration-1000 ease-in-out relative overflow-hidden`}>
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex justify-between items-center h-20">

                    {/* Logo Area - Enhanced */}
                    <div
                        className="flex items-center space-x-4 cursor-pointer group"
                        onClick={() => navigate('/')}
                    >
                        <div className="relative">
                            <img
                                src={logo}
                                alt="Library Logo"
                                className="h-14 w-auto drop-shadow-lg transform group-hover:rotate-3 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"></div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-blue-200 to-purple-200 bg-clip-text text-transparent group-hover:from-blue-200 group-hover:to-purple-100 transition-all duration-300">
                                LibraryHub
                            </h1>
                            <p className="text-xs text-blue-200/80 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Your Gateway to Knowledge
                            </p>
                        </div>
                    </div>

                    {/* Desktop Navigation - Enhanced */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/"
                            className="relative px-4 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group"
                        >
                            <span className="relative z-10">Home</span>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                        </Link>

                        <Link
                            to="/books"
                            className="relative px-4 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group"
                        >
                            <span className="relative z-10">Books</span>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                        </Link>

                        <Link
                            to="/categories"
                            className="relative px-4 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group"
                        >
                            <span className="relative z-10">Categories</span>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                        </Link>

                        <Link
                            to="/about"
                            className="relative px-4 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group"
                        >
                            <span className="relative z-10">About</span>
                            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                        </Link>

                        {/* Role-Based Links */}
                        {authState.isLoggedIn && authState.role === "ADMIN" && (
                            <Link
                                to="/admin/dashboard"
                                className="relative overflow-hidden group bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <span className="relative z-10 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Admin
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                        )}

                        {authState.isLoggedIn && authState.role === "USER" && (
                            <Link
                                to="/profile"
                                className="relative overflow-hidden group bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold px-5 py-2 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <span className="relative z-10 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Profile
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </Link>
                        )}
                    </div>

                    {/* Right Side Buttons (Dynamic) */}
                    <div className="flex items-center space-x-4">
                        {!authState.isLoggedIn ? (
                            <>
                                {/* Login Button */}
                                <Link
                                    to="/login"
                                    className="relative overflow-hidden group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <span className="relative z-10 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                        </svg>
                                        Login
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>

                                {/* Register Button */}
                                <Link
                                    to="/register"
                                    className="relative overflow-hidden group bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <span className="relative z-10 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                        </svg>
                                        Register
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Welcome Text with Username */}
                                <div className="hidden md:flex flex-col items-end mr-3">
                                    <span className="text-sm text-blue-200/90 font-medium">
                                        Welcome back,
                                    </span>
                                    <span className="text-white font-semibold">
                                        {authState.username || (authState.role === 'ADMIN' ? 'Admin' : 'Reader')}
                                    </span>
                                </div>

                                {/* Logout Button */}
                                <button
                                    onClick={handleLogout}
                                    className="relative overflow-hidden group bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                >
                                    <span className="relative z-10 flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Log Out
                                    </span>
                                    <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                </button>
                            </>
                        )}

                        {/* Mobile menu button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-colors duration-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl border-t border-white/20 rounded-b-2xl shadow-2xl">
                        <div className="px-4 py-6 space-y-2">
                            <Link
                                to="/"
                                className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link
                                to="/books"
                                className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Books
                            </Link>
                            <Link
                                to="/categories"
                                className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Categories
                            </Link>
                            <Link
                                to="/about"
                                className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-200"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                About
                            </Link>

                            {/* Mobile Role-Based Links */}
                            {authState.isLoggedIn && authState.role === "ADMIN" && (
                                <Link
                                    to="/admin/dashboard"
                                    className="block px-4 py-3 text-yellow-300 font-semibold hover:text-yellow-100 hover:bg-white/10 rounded-xl transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                            {authState.isLoggedIn && authState.role === "USER" && (
                                <Link
                                    to="/profile"
                                    className="block px-4 py-3 text-green-300 font-semibold hover:text-green-100 hover:bg-white/10 rounded-xl transition-colors duration-200"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Profile
                                </Link>
                            )}

                            {/* Mobile Login/Register */}
                            {!authState.isLoggedIn ? (
                                <div className="pt-4 border-t border-white/20 space-y-3">
                                    <Link
                                        to="/login"
                                        className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold text-center rounded-xl shadow-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        to="/register"
                                        className="block px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold text-center rounded-xl shadow-lg"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Register
                                    </Link>
                                </div>
                            ) : (
                                <div className="pt-4 border-t border-white/20">
                                    <div className="px-4 py-3 text-center">
                                        <p className="text-blue-200/90 text-sm">Welcome, {authState.username || (authState.role === 'ADMIN' ? 'Admin' : 'Reader')}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMenuOpen(false);
                                        }}
                                        className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-xl shadow-lg"
                                    >
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;