import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../components/StarRating'; // <--- MAKE SURE THIS PATH IS CORRECT

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- Data State ---
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]); // <--- NEW
    const [loading, setLoading] = useState(true);
    const [alreadyRented, setAlreadyRented] = useState(false);

    // --- UI State ---
    const [renting, setRenting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // --- Review Form State ---
    const [userRating, setUserRating] = useState(0); // <--- NEW
    const [comment, setComment] = useState("");      // <--- NEW

    // --- Error Notification State ---
    const [errorMsg, setErrorMsg] = useState("");

    // Helper to fetch data (refactored to be reusable)
    const loadData = async () => {
        try {
            // 1. Get Book Details
            const bookRes = await axios.get(`http://localhost:8080/api/books/${id}`);
            setBook(bookRes.data);

            // 2. Get Reviews (NEW)
            const reviewsRes = await axios.get(`http://localhost:8080/api/reviews/book/${id}`);
            setReviews(reviewsRes.data);

            // 3. Check Rental Status
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (token) {
                const checkRes = await axios.get(`http://localhost:8080/api/loans/check/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setAlreadyRented(checkRes.data);
            }
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    // Helper to clear error after 4 seconds
    const triggerError = (msg) => {
        setErrorMsg(msg);
        setShowModal(false);
        setTimeout(() => setErrorMsg(""), 4000);
    };

    // --- RENTAL LOGIC ---
    const handleConfirmRent = async () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            navigate("/login");
            return;
        }

        setRenting(true);
        try {
            await axios.post(`http://localhost:8080/api/loans/rent/${id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowModal(false);
            navigate("/my-books");
        } catch (error) {
            const message = error.response?.data?.message || "Rental failed.";
            triggerError(message);
        } finally {
            setRenting(false);
        }
    };

    // --- REVIEW LOGIC (NEW) ---
    const handleSubmitReview = async () => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        if (!token) {
            triggerError("You must be logged in to vote.");
            return;
        }
        if (userRating === 0) {
            triggerError("Please select a star rating.");
            return;
        }

        try {
            await axios.post("http://localhost:8080/api/reviews/add", {
                bookId: id,
                rating: userRating,
                comment: comment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Reset form and reload data to show new average
            setComment("");
            setUserRating(0);
            alert("Review submitted!");
            loadData();
        } catch (error) {
            const msg = error.response?.data || "Failed to submit review.";
            triggerError(msg);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!book) return <div className="text-center py-20">Book not found!</div>;

    return (
        <div className="max-w-5xl mx-auto px-4 py-10 relative">

            {/* --- ERROR TOAST --- */}
            {errorMsg && (
                <div className="fixed top-24 right-5 z-50 animate-bounce-in">
                    <div className="bg-white border-l-4 border-red-500 shadow-2xl rounded-lg p-4 flex items-center pr-8 min-w-[300px]">
                        <div className="text-red-500 bg-red-100 rounded-full p-2 mr-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Action Failed</h4>
                            <p className="text-sm text-gray-600">{errorMsg}</p>
                        </div>
                        <button onClick={() => setErrorMsg("")} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
            )}

            <button onClick={() => navigate('/books')} className="mb-6 text-blue-600 font-semibold hover:underline">
                ← Back to Collection
            </button>

            {/* --- MAIN CARD --- */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row mb-12">
                {/* Visual Cover */}
                <div className={`md:w-1/3 p-8 flex items-center justify-center text-white relative overflow-hidden ${alreadyRented ? 'bg-gray-600' : 'bg-gradient-to-br from-blue-600 to-purple-600'}`}>
                    <div className="text-center relative z-10">
                        <h1 className="text-6xl font-bold mb-2 opacity-90">{book.title.charAt(0)}</h1>
                        <p className="opacity-75 font-medium tracking-wide">
                            {alreadyRented ? "OWNED COPY" : "DIGITAL EDITION"}
                        </p>
                    </div>
                </div>

                {/* Info Section */}
                <div className="p-8 md:w-2/3 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                                <p className="text-lg text-gray-600 mt-1">by {book.author}</p>
                            </div>
                            {alreadyRented ? (
                                <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase border border-green-200">
                                    In Your Library
                                </span>
                            ) : (
                                <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase border border-blue-100">
                                    {book.category}
                                </span>
                            )}
                        </div>

                        {/* NEW: Average Rating Badge */}
                        <div className="flex items-center mb-6 bg-yellow-50 w-fit px-3 py-1.5 rounded-lg border border-yellow-100">
                            <span className="text-2xl font-bold text-yellow-600 mr-2 leading-none">{book.averageRating || "0.0"}</span>
                            <div className="flex flex-col">
                                <StarRating rating={book.averageRating || 0} />
                                <span className="text-xs text-yellow-700 mt-0.5">{book.totalVotes || 0} votes</span>
                            </div>
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {book.description || "No description available."}
                        </p>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="mt-4 pt-6 border-t border-gray-100">
                        {alreadyRented ? (
                            <button
                                onClick={() => navigate('/my-books')}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center gap-2"
                            >
                                Read Now (Active Rental)
                            </button>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between items-center text-sm font-bold text-gray-500">
                                    <span>PRICE: $5.00</span>
                                    <span>ACCESS: 3 DAYS</span>
                                </div>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                                >
                                    Rent Digital Copy
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- NEW: REVIEWS & RATINGS SECTION --- */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">

                {/* Left: Write a Review */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 h-fit">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 p-1.5 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        </span>
                        Write a Review
                    </h3>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Tap stars to rate</label>
                        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200 w-fit">
                            <StarRating rating={userRating} onRate={setUserRating} editable={true} />
                        </div>
                    </div>

                    <div className="mb-4">
                        <textarea
                            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            rows="4"
                            placeholder="What did you think about this book?"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>

                    <button
                        onClick={handleSubmitReview}
                        disabled={userRating === 0}
                        className={`w-full py-3 rounded-xl font-bold text-white transition-colors shadow-md ${
                            userRating === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        Submit Review
                    </button>
                </div>

                {/* Right: Community Reviews */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-600 p-1.5 rounded-lg">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                        </span>
                        Community Reviews ({reviews.length})
                    </h3>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {reviews.length === 0 ? (
                            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <p className="text-gray-500 italic">No reviews yet.</p>
                                <p className="text-sm text-gray-400 mt-1">Be the first to rate this book!</p>
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="font-bold text-gray-800">{review.username}</span>
                                            <div className="flex mt-1">
                                                <StarRating rating={review.rating} />
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {new Date(review.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                        {review.comment || <span className="italic text-gray-400">No comment provided.</span>}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* CONFIRMATION MODAL (UNCHANGED) */}
            {showModal && (
                <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
                            <h3 className="text-2xl font-bold">Confirm Rental</h3>
                        </div>
                        <div className="p-8">
                            <div className="flex justify-between mb-6 border-b pb-4">
                                <span className="font-bold text-gray-700">{book.title}</span>
                                <span className="font-bold text-blue-600">$5.00</span>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={() => setShowModal(false)} className="flex-1 py-3 border rounded-xl hover:bg-gray-50">Cancel</button>
                                <button onClick={handleConfirmRent} disabled={renting} className="flex-1 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 flex justify-center">
                                    {renting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : "Pay & Read"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BookDetails;