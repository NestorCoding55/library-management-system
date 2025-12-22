import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom'; // 1. Import useSearchParams

const Books = () => {
    // 2. Get the Search Params (to read ?category=History)
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get("category"); // This will be "History", "Science Fiction", or null

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search & Pagination State
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // Scroll to Top Logic
    const location = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    // 3. Updated Fetch Function
    const fetchBooks = async () => {
        try {
            setLoading(true);

            // Default URL: Get ALL books
            let url = "http://localhost:8080/api/books";

            // IF we have a category filter, use the category endpoint instead
            if (categoryFilter) {
                // Example: /api/books/category?category=History
                url = `http://localhost:8080/api/books/category?category=${encodeURIComponent(categoryFilter)}`;
            }

            const response = await fetch(url);
            if (!response.ok) throw new Error("Failed to connect");

            const data = await response.json();
            setBooks(data);
            setError(null);
        } catch (err) {
            console.error(err);
            setError("Could not load books.");
        } finally {
            setLoading(false);
        }
    };

    // 4. Update useEffect to run whenever the categoryFilter changes
    useEffect(() => {
        fetchBooks();
        setSearchTerm(""); // Optional: Clear the search bar when switching categories
    }, [categoryFilter]);

    // Reset to page 1 when searching
    useEffect(() => { setCurrentPage(1); }, [searchTerm]);

    // Filter Logic (Client Side Search)
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBooks = filteredBooks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* HEADER & SEARCH BAR */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {/* 5. Dynamic Header: Show "History Books" or "Library Collection" */}
                        {categoryFilter ? `${categoryFilter} Books` : "Library Collection"}
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {categoryFilter ? `Browsing category: ${categoryFilter}` : "Explore our vast collection."}
                    </p>

                    {/* Show a "Show All" button if a filter is active */}
                    {categoryFilter && (
                        <Link to="/books" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                            ← Back to all books
                        </Link>
                    )}
                </div>

                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search within these books..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    />
                    <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* ERROR MESSAGE */}
            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 text-center border border-red-200">{error}</div>}

            {/* LOADING SPINNER */}
            {loading && (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">Loading library...</p>
                </div>
            )}

            {/* MAIN CONTENT */}
            {!loading && !error && (
                <>
                    {/* PAGINATION BAR */}
                    {totalPages > 1 && (
                        <div className="flex justify-center md:justify-end items-center mb-6 space-x-2">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                                    currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                }`}
                            >
                                Prev
                            </button>

                            <div className="hidden sm:flex space-x-1">
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        onClick={() => paginate(i + 1)}
                                        className={`w-8 h-8 rounded-md border text-sm font-medium transition-colors ${
                                            currentPage === i + 1
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                                        }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 border rounded-md text-sm transition-colors ${
                                    currentPage === totalPages
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 hover:bg-gray-50 border-gray-300'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    )}

                    {/* BOOK GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[515px] content-start">
                        {currentBooks.length > 0 ? (
                            currentBooks.map((book) => (
                                <div key={book.id} className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300">
                                    <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                                    <div className="p-6 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <span className="text-xs font-semibold tracking-wide uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                {book.category}
                                            </span>
                                        </div>
                                        <h3 className="mt-4 text-xl font-bold text-gray-800">{book.title}</h3>
                                        <p className="text-gray-500 text-sm mt-1 mb-4">by {book.author}</p>

                                        <div className="mt-auto flex items-center justify-between">
                                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                book.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                             {book.available ? 'Available' : 'Borrowed'}
                                            </span>
                                            <Link
                                                to={`/books/${book.id}`}
                                                className="text-blue-600 hover:text-purple-600 font-semibold text-sm transition-colors flex items-center gap-1"
                                            >
                                                Details <span>→</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                {/* Improved Empty State */}
                                {categoryFilter ? (
                                    <p>No books found in the category <strong>{categoryFilter}</strong>.</p>
                                ) : (
                                    <p>No books found matching your search.</p>
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default Books;