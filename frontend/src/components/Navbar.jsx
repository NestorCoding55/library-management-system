import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 text-white shadow-2xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">

                    {/* Left side: Logo with enhanced styling */}
                    <div className="flex items-center space-x-4 group cursor-pointer transition-transform duration-300 hover:scale-105">
                        <div className="relative">
                            <img
                                src={logo}
                                alt="Library Logo"
                                className="h-14 w-auto filter drop-shadow-lg transform group-hover:rotate-6 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-0 group-hover:opacity-10 rounded-full transition-opacity duration-300"></div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 to-purple-200 bg-clip-text text-transparent">
                                Library
                            </h1>
                            <p className="text-xs text-blue-200 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Your Gateway to Knowledge
                            </p>
                        </div>
                    </div>

                    {/* Center: Navigation Links */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="relative px-3 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group">
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link to="/books" className="relative px-3 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group">
                            Books
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link to="/categories" className="relative px-3 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group">
                            Categories
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                        <Link to="/about" className="relative px-3 py-2 text-blue-100 hover:text-white font-medium transition-colors duration-200 group">
                            About
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
                        </Link>
                    </div>

                    {/* Right side: Buttons with enhanced design */}
                    <div className="flex items-center space-x-4">
                        {/* CHANGED: Button -> Link to /login */}
                        <Link to="/login" className="relative overflow-hidden group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                            <span className="relative z-10">Login</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                        </Link>

                        {/* CHANGED: Button -> Link to /register */}
                        <Link to="/register" className="relative overflow-hidden group bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300">
                            <span className="relative z-10">Register</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                        </Link>

                        {/* Mobile menu button */}
                        <button className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg bg-blue-800/30 hover:bg-blue-700/40 transition-colors duration-200">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className="md:hidden bg-gradient-to-b from-blue-800/90 to-indigo-800/90 backdrop-blur-lg">
                <div className="px-4 py-4 space-y-3">
                    <Link to="/" className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-blue-700/30 rounded-xl transition-colors duration-200">
                        Home
                    </Link>
                    <Link to="/books" className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-blue-700/30 rounded-xl transition-colors duration-200">
                        Books
                    </Link>
                    <Link to="/categories" className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-blue-700/30 rounded-xl transition-colors duration-200">
                        Categories
                    </Link>
                    <Link to="/about" className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-blue-700/30 rounded-xl transition-colors duration-200">
                        About
                    </Link>

                    {/* ADDED: Mobile Authentication Links */}
                    <div className="border-t border-blue-700/50 my-2 pt-2">
                        <Link to="/login" className="block px-4 py-3 text-blue-100 hover:text-white hover:bg-blue-700/30 rounded-xl transition-colors duration-200">
                            Login
                        </Link>
                        <Link to="/register" className="block px-4 py-3 text-purple-200 font-bold hover:text-white hover:bg-purple-700/30 rounded-xl transition-colors duration-200">
                            Register
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;