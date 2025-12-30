import { useState, useEffect } from "react";
import authService from "../services/authService";
import { useNavigate, Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [gradientIndex, setGradientIndex] = useState(0);
    const [rememberMe, setRememberMe] = useState(false); // Added for "Keep me signed in"
    const navigate = useNavigate();
    const location = useLocation();

    // Dynamic gradients for entire page (only blues and purples)
    const gradients = [
        "from-indigo-900 via-blue-900 to-purple-900",
        "from-blue-900 via-indigo-900 to-purple-900",
        "from-purple-900 via-blue-900 to-indigo-900",
        "from-blue-900 via-purple-900 to-indigo-900",
        "from-indigo-800 via-blue-800 to-purple-800",
        "from-purple-800 via-indigo-800 to-blue-800"
    ];

    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo(0, 0);

        // Change gradient every 5 seconds (quicker)
        const interval = setInterval(() => {
            setGradientIndex((prev) => (prev + 1) % gradients.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [location]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const response = await authService.login(formData);

            // Choose storage based on "Keep me signed in" checkbox
            const storage = rememberMe ? localStorage : sessionStorage;

            // Store in chosen storage
            storage.setItem("token", response.data.token);
            storage.setItem("role", response.data.role);
            storage.setItem("username", formData.username); // Store the username too!

            // Clear the other storage to avoid conflicts
            if (rememberMe) {
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("role");
                sessionStorage.removeItem("username");
            } else {
                localStorage.removeItem("token");
                localStorage.removeItem("role");
                localStorage.removeItem("username");
            }

            if (response.data.role === "ADMIN") {
                navigate("/admin/dashboard");
            } else {
                navigate("/profile");
            }

            window.location.reload();

        } catch (err) {
            setError("Invalid username or password. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={`min-h-screen flex bg-gradient-to-br ${gradients[gradientIndex]} transition-all duration-1000 ease-in-out`}>

            {/* Left side - Full Gradient Panel */}
            <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-between">

                {/* Logo/Branding */}
                <div className="relative mt-12">
                    <div className="absolute -inset-4 bg-white/5 blur-xl rounded-3xl"></div>
                    <div className="relative">
                        <h1 className="text-5xl font-bold text-white mb-3">Library<span className="text-blue-300"></span></h1>
                        <p className="text-blue-200/80 text-lg">Your Gateway to Infinite Knowledge</p>
                    </div>
                </div>

                {/* Featured Content - Centered */}
                <div className="flex-1 flex flex-col justify-center">
                    <div className="space-y-10">
                        <div className="flex items-start space-x-6 transform hover:translate-x-2 transition-transform duration-300">
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                <svg className="w-10 h-10 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-2">1,000+ Books</h3>
                                <p className="text-blue-200/80 text-lg">Digital and physical collection</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6 transform hover:translate-x-2 transition-transform duration-300">
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                <svg className="w-10 h-10 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-2">Secure Access</h3>
                                <p className="text-blue-200/80 text-lg">Your reading data protected</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-6 transform hover:translate-x-2 transition-transform duration-300">
                            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                                <svg className="w-10 h-10 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-semibold text-white mb-2">Lightning Fast</h3>
                                <p className="text-blue-200/80 text-lg">Instant access to all books</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quote/Testimonial */}
                <div className="bg-white/10 backdrop-blur-sm p-8 rounded-3xl border border-white/20 transform hover:scale-[1.02] transition-transform duration-300">
                    <p className="text-white italic text-lg mb-4">"The best digital library experience I've ever had. Access to thousands of books right at my fingertips!"</p>
                    <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                        <div className="ml-4">
                            <p className="text-white font-medium text-lg">Sarah Johnson</p>
                            <p className="text-blue-200/80">Book Club Member</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side - Login Form with Stats */}
            <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-12">
                <div className="max-w-md w-full mx-auto mt-12 lg:mt-0">
                    {/* Header - Moved further down from top */}
                    <div className="mb-10">
                        {/* Back to Home - Placed lower and with better spacing */}
                        <Link
                            to="/"
                            className="inline-flex items-center text-white hover:text-blue-300 mb-8 transition-colors duration-200 group"
                        >
                            <svg className="w-5 h-5 mr-2 transform group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>

                        <h1 className="text-4xl font-bold text-white mb-3">
                            Welcome Back<span className="text-blue-300">.</span>
                        </h1>
                        <p className="text-blue-200/90">
                            Sign in to continue your reading journey and access personalized recommendations.
                        </p>
                    </div>

                    {/* Login Form - White Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-200/50 mb-8 transform hover:shadow-3xl transition-all duration-300">
                        {error && (
                            <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 rounded-lg">
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 text-red-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                    </svg>
                                    <span className="text-red-800 font-medium">{error}</span>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Username or Email
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                        placeholder="Enter your username"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <Link
                                        to="/forgot-password"
                                        className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline"
                                    >
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 pr-12"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-500 transition-colors duration-200"
                                    >
                                        {showPassword ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="remember"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                        Keep me signed in
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                            </svg>
                                            Sign In
                                        </>
                                    )}
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-blue-600 hover:text-blue-800 font-semibold hover:underline"
                                >
                                    Create an account
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-3 gap-4 text-center bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-white/20">
                        <div className="transform hover:scale-105 transition-transform duration-200">
                            <div className="text-3xl font-bold text-blue-600 mb-1">50k+</div>
                            <div className="text-sm font-medium text-gray-700">Active Readers</div>
                        </div>
                        <div className="transform hover:scale-105 transition-transform duration-200">
                            <div className="text-3xl font-bold text-purple-600 mb-1">1k+</div>
                            <div className="text-sm font-medium text-gray-700">Books</div>
                        </div>
                        <div className="transform hover:scale-105 transition-transform duration-200">
                            <div className="text-3xl font-bold text-indigo-600 mb-1">4.8</div>
                            <div className="text-sm font-medium text-gray-700">Rating</div>
                        </div>
                    </div>

                    {/* Mobile view for gradient panel content */}
                    <div className="lg:hidden mt-10">
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                                    <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-white mb-2">10,000+ Books</h3>
                                    <p className="text-blue-200/80">Digital and physical collection</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;