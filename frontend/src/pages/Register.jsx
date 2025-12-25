import { useState, useEffect } from "react";
import authService from "../services/authService"; // Make sure this path is correct
import { useNavigate, useLocation, Link } from "react-router-dom";

const Register = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    // --- NEW: Password Strength State ---
    const [passwordChecks, setPasswordChecks] = useState({
        length: false,
        nums: false,
        letters: false,
        special: false
    });
    const [strengthScore, setStrengthScore] = useState(0); // 0 to 100

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    // --- NEW: Monitor Password Changes for Strength ---
    useEffect(() => {
        const p = formData.password;
        const checks = {
            length: p.length >= 12 && p.length <= 24,
            nums: (p.match(/\d/g) || []).length >= 5,
            letters: (p.match(/[a-zA-Z]/g) || []).length >= 5,
            special: /[^a-zA-Z0-9]/.test(p)
        };
        setPasswordChecks(checks);

        // Calculate score (0, 25, 50, 75, 100)
        const validCount = Object.values(checks).filter(Boolean).length;
        setStrengthScore((validCount / 4) * 100);

    }, [formData.password]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // --- NEW: Block submit if password is weak ---
        if (strengthScore < 100) {
            alert("Please ensure your password meets all requirements.");
            return;
        }

        setIsSubmitting(true);

        try {
            await authService.register(formData);
            alert("Registration Successful! Now please login.");
            navigate("/login");
        } catch (error) {
            console.error(error);
            // Handle specific backend errors (like "Username taken")
            const msg = error.response?.data?.message || "Registration failed.";
            alert(msg);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Helper for Bar Color
    const getBarColor = () => {
        if (strengthScore < 50) return "bg-red-500";
        if (strengthScore < 100) return "bg-yellow-500";
        return "bg-green-500";
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Join Our <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Library</span>
                    </h1>
                    <p className="text-gray-600 text-lg max-w-lg mx-auto">
                        Create your account to access thousands of books, track your reading, and discover new adventures.
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                    <div className="p-8 sm:p-10">
                        {/* Decorative Top Bar */}
                        <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full mb-8"></div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Username Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Username
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 group-hover:border-blue-400"
                                        placeholder="Enter your username"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Email Address
                                </label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 group-hover:border-blue-400"
                                        placeholder="Enter your email"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-gray-700">
                                    Password
                                </label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 group-hover:border-blue-400"
                                        placeholder="Create a strong password"
                                    />
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 text-gray-400 pointer-events-none">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>

                                {/* --- NEW: Password Strength Indicator --- */}
                                {formData.password && (
                                    <div className="mt-3 space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-100">

                                        {/* Progress Bar */}
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full transition-all duration-500 ease-out ${getBarColor()}`}
                                                style={{ width: `${strengthScore}%` }}
                                            ></div>
                                        </div>

                                        {/* Requirements Checklist */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                            <div className={`flex items-center space-x-2 ${passwordChecks.length ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                                <span>{passwordChecks.length ? '✓' : '○'}</span>
                                                <span>12-24 Characters</span>
                                            </div>
                                            <div className={`flex items-center space-x-2 ${passwordChecks.nums ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                                <span>{passwordChecks.nums ? '✓' : '○'}</span>
                                                <span>At least 5 Numbers</span>
                                            </div>
                                            <div className={`flex items-center space-x-2 ${passwordChecks.letters ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                                <span>{passwordChecks.letters ? '✓' : '○'}</span>
                                                <span>At least 5 Letters</span>
                                            </div>
                                            <div className={`flex items-center space-x-2 ${passwordChecks.special ? 'text-green-600 font-medium' : 'text-gray-500'}`}>
                                                <span>{passwordChecks.special ? '✓' : '○'}</span>
                                                <span>1 Special Character</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Terms and Conditions */}
                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label htmlFor="terms" className="text-sm text-gray-600">
                                    I agree to the{" "}
                                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                                        Terms of Service
                                    </a>{" "}
                                    and{" "}
                                    <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
                                        Privacy Policy
                                    </a>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                // Disabled if submitting OR password is weak
                                disabled={isSubmitting || strengthScore < 100}
                                className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </span>
                            </button>

                            {/* Divider */}
                            <div className="relative my-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-white text-gray-500">Already have an account?</span>
                                </div>
                            </div>

                            {/* Login Link */}
                            <div className="text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    Sign in to your account
                                </Link>
                            </div>
                        </form>
                    </div>

                    {/* Stats Footer */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200 p-6">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-xl font-bold text-blue-600">10k+</div>
                                <div className="text-sm text-gray-600">Books Available</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-purple-600">24/7</div>
                                <div className="text-sm text-gray-600">Access Anywhere</div>
                            </div>
                            <div>
                                <div className="text-xl font-bold text-indigo-600">Free</div>
                                <div className="text-sm text-gray-600">Forever</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>By registering, you'll get access to personalized recommendations, reading lists, and more.</p>
                </div>
            </div>
        </div>
    );
};

export default Register;