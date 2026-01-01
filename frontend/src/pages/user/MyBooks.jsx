import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate

const MyBooks = () => {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchMyBooks = async () => {
            try {
                const token = localStorage.getItem("token") || sessionStorage.getItem("token");
                const res = await axios.get("http://localhost:8080/api/loans/my-books", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setLoans(res.data);
            } catch (err) {
                console.error("Error fetching my books", err);
            } finally {
                setLoading(false);
            }
        };
        fetchMyBooks();
    }, []);

    const getDaysLeft = (expiryDate) => {
        const now = new Date();
        const end = new Date(expiryDate);
        const diffTime = end - now; // Removed Math.abs to allow negative numbers (expired)

        if (diffTime <= 0) return 0; // If expired, return 0

        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">

            {/* --- BACK BUTTON SECTION --- */}
            <div className="mb-6">
                <button
                    onClick={() => navigate(-1)} // Go back to previous page
                    className="flex items-center text-gray-600 hover:text-blue-600 transition-colors font-medium"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back
                </button>
            </div>

            <h1 className="text-3xl font-bold mb-8 text-gray-900">My Active Rentals</h1>

            {loans.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <div className="mx-auto h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No active rentals</h3>
                    <p className="text-gray-500 mb-6">Your library is currently empty.</p>
                    <Link to="/books" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-all">
                        Browse Collection
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loans.map((loan) => {
                        const daysLeft = getDaysLeft(loan.expiryDate);
                        const isExpiringSoon = daysLeft <= 1;

                        return (
                            <div key={loan.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl transition-shadow duration-300">
                                <div className={`h-2 ${isExpiringSoon ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{loan.book.title}</h3>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-6">by {loan.book.author}</p>

                                    <div className={`flex justify-between items-center p-3 rounded-lg mb-6 ${isExpiringSoon ? 'bg-red-50' : 'bg-green-50'}`}>
                                        <span className={`text-sm font-medium ${isExpiringSoon ? 'text-red-700' : 'text-green-700'}`}>
                                            {isExpiringSoon ? 'Expiring Soon:' : 'Expires in:'}
                                        </span>
                                        <span className={`font-bold ${isExpiringSoon ? 'text-red-700' : 'text-green-700'}`}>
                                            {daysLeft} Days
                                        </span>
                                    </div>

                                    <button className="w-full mt-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-bold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all">
                                        Read Now
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBooks;