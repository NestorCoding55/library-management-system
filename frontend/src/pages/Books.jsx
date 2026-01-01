import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios'; // We switch to Axios for easier Header/Token handling

const Books = () => {
    // --- 1. SEARCH PARAMS & LOCATION ---
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get("category");
    const location = useLocation();

    // --- 2. STATE ---
    const [books, setBooks] = useState([]);
    const [myRentedBookIds, setMyRentedBookIds] = useState(new Set()); // Store IDs of books I own
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search & Pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // --- 3. SCROLL TO TOP ---
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    // --- 4. FETCH DATA (The Core Logic) ---
    const fetchData = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            // A. Prepare URLs
            let booksUrl = "http://localhost:8080/api/books";
            if (categoryFilter) {
                booksUrl = `http://localhost:8080/api/books/category?category=${encodeURIComponent(categoryFilter)}`;
            }

            // B. Fetch All Books
            const booksRes = await axios.get(booksUrl);
            setBooks(booksRes.data);

            // C. Fetch My Loans (ONLY if logged in)
            if (token) {
                try {
                    const loansRes = await axios.get("http://localhost:8080/api/loans/my-books", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    // Extract Book IDs into a Set for fast "O(1)" lookup
                    const rentedIds = new Set(loansRes.data.map(loan => loan.book.id));
                    setMyRentedBookIds(rentedIds);
                } catch (loanErr) {
                    console.error("Could not fetch loans (user might be admin or token expired)", loanErr);
                }
            }

            setError(null);
        } catch (err) {
            console.error(err);
            setError("Could not load library collection.");
        } finally {
            setLoading(false);
        }
    };

    // --- 5. EFFECTS ---
    useEffect(() => {
        fetchData();
        setSearchTerm("");
        setCurrentPage(1);
    }, [categoryFilter]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    // --- 6. FILTERING & PAGINATION ---
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {categoryFilter ? `${categoryFilter} Books` : "Library Collection"}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {categoryFilter ? `Browsing category: ${categoryFilter}` : "Explore our vast digital collection."}
                    </p>
                    {categoryFilter && (
                        <Link to="/books" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                            ← Back to all books
                        </Link>
                    )}
                </div>

                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 text-center border border-red-200">{error}</div>}

            {loading && (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading library...</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                        <div className="flex justify-center md:justify-end items-center mb-6 space-x-2">
                            <button onClick={handlePrev} disabled={currentPage === 1} className={`px-3 py-1 border rounded-md text-sm transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Prev</button>
                            <span className="text-sm text-gray-600 px-2">Page {currentPage} of {totalPages}</span>
                            <button onClick={handleNext} disabled={currentPage === totalPages} className={`px-3 py-1 border rounded-md text-sm transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}>Next</button>
                        </div>
                    )}

                    {/* BOOK GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[515px] content-start">
                        {currentBooks.length > 0 ? (
                            currentBooks.map((book) => {
                                // --- PERSONALIZED CHECK ---
                                // Does the current user have this book in their "myRentedBookIds" Set?
                                const isOwned = myRentedBookIds.has(book.id);

                                return (
                                    <div key={book.id} className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                        {/* Dynamic Header Color based on ownership */}
                                        <div className={`h-2 ${isOwned ? 'bg-green-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}></div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-semibold tracking-wide uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                    {book.category}
                                                </span>
                                                {/* OWNED BADGE */}
                                                {isOwned && (
                                                    <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-md border border-green-200 shadow-sm">
                                                        OWNED
                                                    </span>
                                                )}
                                            </div>

                                            <h3 className="mt-4 text-xl font-bold text-gray-800">{book.title}</h3>
                                            <p className="text-gray-500 text-sm mt-1 mb-4">by {book.author}</p>

                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                                {/* STATUS TEXT */}
                                                {isOwned ? (
                                                    <span className="flex items-center text-green-600 text-sm font-bold">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                        Read Now
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 text-sm font-medium">
                                                        $5.00 / 3 Days
                                                    </span>
                                                )}

                                                <Link
                                                    to={`/books/${book.id}`}
                                                    className={`${
                                                        isOwned ? 'text-green-600 hover:text-green-800' : 'text-blue-600 hover:text-purple-600'
                                                    } font-semibold text-sm transition-colors flex items-center gap-1`}
                                                >
                                                    {isOwned ? "Open" : "Details"} <span>→</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                {categoryFilter ? <p>No books found in <strong>{categoryFilter}</strong>.</p> : <p>No books found.</p>}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Books;