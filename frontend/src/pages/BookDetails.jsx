import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const BookDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Data State
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [alreadyRented, setAlreadyRented] = useState(false);

    // UI State
    const [renting, setRenting] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // --- NEW: Error Notification State ---
    const [errorMsg, setErrorMsg] = useState("");
    // -------------------------------------

    useEffect(() => {
        const loadData = async () => {
            try {
                const bookRes = await fetch(`http://localhost:8080/api/books/${id}`);
                const bookData = await bookRes.json();
                setBook(bookData);

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
        loadData();
    }, [id]);

    // Helper to clear error after 3 seconds
    const triggerError = (msg) => {
        setErrorMsg(msg);
        setShowModal(false); // Close the rental modal
        setTimeout(() => setErrorMsg(""), 4000); // Hide error after 4s
    };

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
            // --- REPLACE ALERT WITH BEAUTIFUL ERROR ---
            const message = error.response?.data?.message || "Rental failed.";
            triggerError(message);
        } finally {
            setRenting(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!book) return <div className="text-center py-20">Book not found!</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10 relative">

            {/* --- NEW: BEAUTIFUL ERROR TOAST --- */}
            {errorMsg && (
                <div className="fixed top-24 right-5 z-50 animate-bounce-in">
                    <div className="bg-white border-l-4 border-red-500 shadow-2xl rounded-lg p-4 flex items-center pr-8 min-w-[300px]">
                        <div className="text-red-500 bg-red-100 rounded-full p-2 mr-3">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-800">Rent Failed</h4>
                            <p className="text-sm text-gray-600">Try again in 3 days.</p>
                        </div>
                        <button onClick={() => setErrorMsg("")} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                </div>
            )}
            {/* ---------------------------------- */}

            <button onClick={() => navigate('/books')} className="mb-6 text-blue-600 font-semibold hover:underline">
                ← Back to Collection
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

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
                        <div className="flex justify-between items-start mb-4">
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
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                Read Now (Go to Library)
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

            {/* CONFIRMATION MODAL */}
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