import logo from '../assets/logo.png';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import LanguageSelector from './LanguageSelector';

const Navbar = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [authState, setAuthState] = useState({
        isLoggedIn: false,
        role: '',
        username: ''
    });

    useEffect(() => {
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
        window.addEventListener('storage', checkAuthState);

        // Close dropdown when clicking outside
        const handleClickOutside = (event) => {
            if (isProfileDropdownOpen && !event.target.closest('.profile-dropdown')) {
                setIsProfileDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            window.removeEventListener('storage', checkAuthState);
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isProfileDropdownOpen]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("username");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("username");

        setIsProfileDropdownOpen(false);
        setIsMenuOpen(false);
        navigate("/login");
        window.location.reload();
    };

    const toggleProfileDropdown = () => {
        setIsProfileDropdownOpen(!isProfileDropdownOpen);
    };

    return (
        <nav className="bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 text-white shadow-2xl sticky top-0 z-50">
            {/* Main Navbar Container */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 lg:h-20">

                    {/* Logo & Brand Section - Left */}
                    <div className="flex items-center flex-shrink-0">
                        <div
                            className="flex items-center space-x-3 cursor-pointer group"
                            onClick={() => navigate('/')}
                        >
                            <div className="relative">
                                <img
                                    src={logo}
                                    alt="Library Logo"
                                    className="h-10 w-auto lg:h-12 drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300"
                                />
                            </div>
                            <div className="hidden md:block">
                                <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-300 via-blue-200 to-purple-200 bg-clip-text text-transparent">
                                    LibraryHub
                                </h1>
                                <p className="text-xs text-blue-200/70 font-medium">
                                    {t('navbar.tagline', 'Your Gateway to Knowledge')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Main Navigation - Center */}
                    <div className="hidden lg:flex flex-1 justify-center">
                        <div className="flex items-center space-x-6">
                            <Link to="/" className="relative px-4 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group">
                                <span className="relative z-10">{t('navbar.home')}</span>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                            </Link>

                            <Link to="/books" className="relative px-4 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group">
                                <span className="relative z-10">{t('navbar.books')}</span>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                            </Link>

                            <Link to="/categories" className="relative px-4 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group">
                                <span className="relative z-10">{t('navbar.categories')}</span>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                            </Link>

                            <Link to="/about" className="relative px-4 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group">
                                <span className="relative z-10">{t('navbar.about')}</span>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                            </Link>

                            <Link to="/support" className="relative px-4 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group">
                                <span className="relative z-10">{t('footer.help_support')}</span>
                                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></div>
                            </Link>
                        </div>
                    </div>

                    {/* User Actions Section - Right */}
                    <div className="flex items-center justify-end space-x-4 flex-shrink-0">

                        {/* Language Selector - Desktop */}
                        <div className="hidden lg:block">
                            <LanguageSelector />
                        </div>

                        {/* Desktop User Actions */}
                        {!authState.isLoggedIn ? (
                            // Guest State
                            <div className="hidden lg:flex items-center space-x-4">
                                <Link to="/login" className="px-5 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    {t('navbar.login')}
                                </Link>
                                <Link to="/register" className="px-5 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                                    {t('navbar.register')}
                                </Link>
                            </div>
                        ) : (
                            // Logged In State
                            <div className="hidden lg:flex items-center space-x-6">
                                {authState.role === "ADMIN" ? (
                                    // ADMIN: Show Dashboard link and Logout button (no dropdown)
                                    <>
                                        <Link
                                            to="/admin/dashboard"
                                            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-medium rounded-lg shadow transition-all duration-300"
                                        >
                                            {t('admin.dashboard_title')}
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg shadow transition-all duration-300"
                                        >
                                            {t('navbar.logout')}
                                        </button>
                                    </>
                                ) : (
                                    // USER: Show Profile Dropdown
                                    <div className="relative profile-dropdown">
                                        <button
                                            onClick={toggleProfileDropdown}
                                            className="flex items-center space-x-3 group focus:outline-none"
                                        >
                                            <div className="flex flex-col items-end">
                                                <span className="text-white font-semibold text-sm">
                                                    {authState.username || 'User'}
                                                </span>
                                                <span className="text-xs text-blue-200/70">
                                                    Library Member
                                                </span>
                                            </div>
                                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:shadow-xl transition-all duration-300">
                                                {authState.username?.charAt(0).toUpperCase() || 'U'}
                                            </div>
                                            <svg
                                                className={`w-4 h-4 text-white/70 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>

                                        {/* Profile Dropdown Menu - Only for USER */}
                                        {isProfileDropdownOpen && (
                                            <div className="absolute right-0 mt-3 w-64 bg-gradient-to-b from-indigo-900 to-purple-900 rounded-xl shadow-2xl border border-white/10 overflow-hidden animate-fadeIn">
                                                {/* User Info Header */}
                                                <div className="p-4 border-b border-white/10">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-lg">
                                                            {authState.username?.charAt(0).toUpperCase() || 'U'}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-white">{authState.username}</h3>
                                                            <p className="text-xs text-blue-200/70">
                                                                Library Member
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Dropdown Links - Only Profile and My Library */}
                                                <div className="py-2">
                                                    <Link
                                                        to="/profile"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                        className="flex items-center px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 transition-colors duration-200"
                                                    >
                                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                        </svg>
                                                        {t('navbar.profile')}
                                                    </Link>

                                                    <Link
                                                        to="/my-books"
                                                        onClick={() => setIsProfileDropdownOpen(false)}
                                                        className="flex items-center px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 transition-colors duration-200"
                                                    >
                                                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                        {t('my_books.title')}
                                                    </Link>
                                                </div>

                                                {/* Logout Button */}
                                                <div className="p-4 border-t border-white/10 bg-gradient-to-r from-red-900/20 to-red-800/10">
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center justify-center w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-medium rounded-lg shadow transition-all duration-300"
                                                    >
                                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                                        </svg>
                                                        {t('navbar.logout')}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <div className="lg:hidden flex items-center gap-3">
                            <LanguageSelector />
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-200"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="lg:hidden bg-gradient-to-b from-indigo-900 via-blue-900 to-purple-900 border-t border-white/20">
                        <div className="px-4 py-6 space-y-1">
                            {/* Mobile Navigation Links */}
                            <Link to="/" className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                                {t('navbar.home')}
                            </Link>
                            <Link to="/books" className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                                {t('navbar.books')}
                            </Link>
                            <Link to="/categories" className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                                {t('navbar.categories')}
                            </Link>
                            <Link to="/about" className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                                {t('navbar.about')}
                            </Link>
                            <Link to="/support" className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-white/10 rounded-xl transition-colors duration-200" onClick={() => setIsMenuOpen(false)}>
                                {t('footer.help_support')}
                            </Link>

                            {/* Mobile Auth Section */}
                            <div className="pt-4 border-t border-white/20 space-y-3">
                                {!authState.isLoggedIn ? (
                                    <>
                                        <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl text-white text-center">
                                            {t('navbar.login')}
                                        </Link>
                                        <Link to="/register" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl text-white text-center">
                                            {t('navbar.register')}
                                        </Link>
                                    </>
                                ) : (
                                    <>
                                        {/* User Info */}
                                        <div className="px-4 py-3 bg-white/5 rounded-xl">
                                            <div className="flex items-center space-x-3">
                                                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                                                    {authState.username?.charAt(0).toUpperCase() || 'U'}
                                                </div>
                                                <div>
                                                    <div className="font-semibold">{authState.username}</div>
                                                    <div className="text-sm text-blue-200/70">
                                                        {authState.role === 'ADMIN' ? 'Administrator' : 'Library Member'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Mobile User Actions */}
                                        {authState.role === "USER" && (
                                            <>
                                                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl text-white text-center">
                                                    {t('navbar.profile')}
                                                </Link>
                                                <Link to="/my-books" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl text-white text-center">
                                                    {t('my_books.title')}
                                                </Link>
                                            </>
                                        )}

                                        {authState.role === "ADMIN" && (
                                            <Link to="/admin/dashboard" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl text-white text-center">
                                                {t('admin.dashboard_title')}
                                            </Link>
                                        )}

                                        <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 rounded-xl text-white">
                                            {t('navbar.logout')}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;