import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate network delay
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-purple-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-white/50 backdrop-blur-sm">

                {/* Header Section */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                        {isSubmitted ? (
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 14l-1 1-1 1H6v-1a2 2 0 00-2-2 2 2 0 012-2 11.953 11.953 0 014.047-8.156Q11.5 3 13 3a2 2 0 012 2zm7 0h2a2 2 0 012 2v3a2 2 0 01-2 2h-2v-2a2 2 0 012-2V9a2 2 0 01-2-2z" />
                            </svg>
                        )}
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        {isSubmitted ? "Check your email" : "Forgot Password?"}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isSubmitted
                            ? `We have sent a password recovery code to ${email}`
                            : "Enter your email address and we'll send you a code to reset your password."}
                    </p>
                </div>

                {/* Content Section: Form OR Success Message */}
                {!isSubmitted ? (
                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="rounded-md shadow-sm -space-y-px">
                            <label htmlFor="email-address" className="sr-only">
                                Email address
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="relative w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Enter your email address"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="relative z-10 flex items-center justify-center">
                                    {isSubmitting ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Reset Code"
                                    )}
                                </span>
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="mt-8 space-y-6">
                        <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-center">
                            <p className="text-sm text-green-800 font-medium">
                                If an account exists for {email}, you will receive a code shortly.
                            </p>
                        </div>

                        <button
                            onClick={() => setIsSubmitted(false)}
                            className="w-full text-blue-600 hover:text-blue-800 text-sm font-semibold transition-colors"
                        >
                            Try a different email
                        </button>
                    </div>
                )}

                {/* Footer Link */}
                <div className="flex items-center justify-center mt-6">
                    <Link
                        to="/login"
                        className="flex items-center text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors duration-200"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;