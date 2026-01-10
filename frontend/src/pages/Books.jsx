import { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../components/StarRating';
import { useTranslation } from 'react-i18next';

const Books = () => {
    const { t } = useTranslation();

    // --- 1. SEARCH PARAMS & LOCATION ---
    const [searchParams] = useSearchParams();
    const categoryFilter = searchParams.get("category");
    const location = useLocation();

    // --- 2. AUTH CHECK (For UI) ---
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const isLoggedIn = !!token;

    // --- 3. STATE ---
    const [books, setBooks] = useState([]);
    const [myRentedBookIds, setMyRentedBookIds] = useState(new Set());
    const [myReadBookIds, setMyReadBookIds] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Search, Sort & Pagination
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    // --- 4. SCROLL TO TOP ---
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location, currentPage]);

    // --- 5. FETCH DATA ---
    const fetchData = async () => {
        try {
            setLoading(true);

            // A. Prepare URLs
            let booksUrl = "https://library-backend.onrender.com/api/books";
            if (categoryFilter) {
                booksUrl = `https://library-backend.onrender.com/api/books/category?category=${encodeURIComponent(categoryFilter)}`;
            }

            // B. Fetch All Books
            const booksRes = await axios.get(booksUrl);
            setBooks(booksRes.data);

            // C. Fetch My Loans (Active & History) - ONLY IF LOGGED IN
            if (token) {
                try {
                    const config = { headers: { Authorization: `Bearer ${token}` } };

                    // 1. Get Active Loans
                    const loansRes = await axios.get("https://library-backend.onrender.com/api/loans/my-books", config);
                    const now = new Date();
                    const activeLoanIds = loansRes.data
                        .filter(loan => new Date(loan.expiryDate) > now)
                        .map(loan => loan.book.id);
                    setMyRentedBookIds(new Set(activeLoanIds));

                    // 2. Get Reading History
                    const historyRes = await axios.get("https://library-backend.onrender.com/api/loans/history", config);
                    const historyIds = historyRes.data.map(loan => loan.book.id);
                    setMyReadBookIds(new Set(historyIds));

                } catch (loanErr) {
                    console.error("Could not fetch user data", loanErr);
                }
            }

            setError(null);
        } catch (err) {
            console.error(err);
            setError(t('books.error_loading', "Could not load library collection."));
        } finally {
            setLoading(false);
        }
    };

    // --- 6. EFFECTS ---
    useEffect(() => {
        fetchData();
        setSearchTerm("");
        setSortBy("title");
        setCurrentPage(1);
    }, [categoryFilter]);

    useEffect(() => { setCurrentPage(1); }, [searchTerm, sortBy]);

    // --- 7. FILTERING, SORTING & PAGINATION ---

    // A. Filter
    const filteredBooks = books.filter((book) =>
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // B. Sort
    const sortedBooks = [...filteredBooks].sort((a, b) => {
        // 1. Sort by Active Rentals (My Books)
        if (sortBy === 'active') {
            const isA = myRentedBookIds.has(a.id);
            const isB = myRentedBookIds.has(b.id);
            if (isA && !isB) return -1;
            if (!isA && isB) return 1;
            return 0;
        }

        // 2. Sort by Read History
        if (sortBy === 'read') {
            const isA = myReadBookIds.has(a.id);
            const isB = myReadBookIds.has(b.id);
            if (isA && !isB) return -1;
            if (!isA && isB) return 1;
            return 0;
        }

        // 3. Standard Sorts
        if (sortBy === 'rating') {
            return (b.averageRating || 0) - (a.averageRating || 0);
        }
        if (sortBy === 'title') {
            return a.title.localeCompare(b.title);
        }
        if (sortBy === 'newest') {
            return b.id - a.id;
        }
        return 0;
    });

    // C. Paginate
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentBooks = sortedBooks.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedBooks.length / itemsPerPage);

    const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
    const handleNext = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {categoryFilter
                            ? t('books.header_cat_title', { category: categoryFilter })
                            : t('books.header_title', "Library Collection")
                        }
                    </h2>
                    <p className="text-gray-500 mt-2">
                        {categoryFilter
                            ? t('books.header_cat_subtitle', { category: categoryFilter })
                            : t('books.header_subtitle', "Explore our vast digital collection.")
                        }
                    </p>
                    {categoryFilter && (
                        <Link to="/books" className="text-sm text-blue-600 hover:underline mt-1 inline-block">
                            {t('books.back_to_all')}
                        </Link>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {/* SORT DROPDOWN (UPDATED) */}
                    <div className="relative">
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="appearance-none w-full sm:w-56 px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer text-gray-700"
                        >
                            <option value="title">{t('books.sort_title')}</option>
                            <option value="rating">{t('books.sort_rating')}</option>
                            <option value="newest">{t('books.sort_newest')}</option>

                            {/* ONLY SHOW THESE IF LOGGED IN */}
                            {isLoggedIn && (
                                <>
                                    <option disabled>──────────</option>
                                    <option value="active">{t('books.sort_active')}</option>
                                    <option value="read">{t('books.sort_history')}</option>
                                </>
                            )}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder={t('books.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 pl-10 rounded-full border border-gray-300 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                        />
                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 text-center border border-red-200">{error}</div>}

            {loading && (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-500">{t('books.loading', "Loading library...")}</p>
                </div>
            )}

            {!loading && !error && (
                <>
                    {/* PAGINATION CONTROLS */}
                    {totalPages > 1 && (
                        <div className="flex justify-center md:justify-end items-center mb-6 space-x-2">
                            <button
                                onClick={handlePrev}
                                disabled={currentPage === 1}
                                className={`px-3 py-1 border rounded-md text-sm transition-colors ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                {t('books.pagination_prev')}
                            </button>
                            <span className="text-sm text-gray-600 px-2">
                                {t('books.pagination_info', { current: currentPage, total: totalPages })}
                            </span>
                            <button
                                onClick={handleNext}
                                disabled={currentPage === totalPages}
                                className={`px-3 py-1 border rounded-md text-sm transition-colors ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                            >
                                {t('books.pagination_next')}
                            </button>
                        </div>
                    )}

                    {/* BOOK GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-h-[515px] content-start">
                        {currentBooks.length > 0 ? (
                            currentBooks.map((book) => {
                                const isOwned = myRentedBookIds.has(book.id);
                                const isRead = myReadBookIds.has(book.id);

                                return (
                                    <div key={book.id} className="bg-white rounded-xl shadow-lg border border-gray-100 flex flex-col h-full hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                                        <div className={`h-2 ${isOwned ? 'bg-green-500' : isRead ? 'bg-purple-500' : 'bg-gradient-to-r from-blue-500 to-purple-500'}`}></div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start">
                                                <span className="text-xs font-semibold tracking-wide uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                                    {book.category}
                                                </span>
                                                <div className="flex flex-col gap-1 items-end">
                                                    {isOwned && (
                                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-2 py-1 rounded-md border border-green-200 shadow-sm">
                                                            {t('books.badge_rented')}
                                                        </span>
                                                    )}
                                                    {isRead && !isOwned && (
                                                        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-md border border-purple-200 shadow-sm">
                                                            {t('books.badge_read')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <h3 className="mt-4 text-xl font-bold text-gray-800">{book.title}</h3>
                                            <p className="text-gray-500 text-sm mt-1">
                                                {t('books.by_author', "by")} {book.author}
                                            </p>

                                            {/* STAR RATING */}
                                            <div className="flex items-center mt-2 mb-4">
                                                <span className="font-bold text-yellow-600 mr-1.5 text-sm">
                                                    {book.averageRating || "0.0"}
                                                </span>
                                                <StarRating rating={book.averageRating || 0} />
                                                <span className="text-xs text-gray-400 ml-1.5">
                                                    ({book.totalVotes || 0} {t('books.votes', "votes")})
                                                </span>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                                                {isOwned ? (
                                                    <span className="flex items-center text-green-600 text-sm font-bold">
                                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                        {t('books.btn_read_now')}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 text-sm font-medium">
                                                        {t('books.price_tag')}
                                                    </span>
                                                )}

                                                <Link
                                                    to={`/books/${book.id}`}
                                                    className={`${
                                                        isOwned ? 'text-green-600 hover:text-green-800' : 'text-blue-600 hover:text-purple-600'
                                                    } font-semibold text-sm transition-colors flex items-center gap-1`}
                                                >
                                                    {isOwned ? t('books.btn_open') : t('books.btn_details')} <span>→</span>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">
                                {categoryFilter ? (
                                    <p>{t('books.no_books_cat', { category: categoryFilter })}</p>
                                ) : (
                                    <p>{t('books.no_books_gen')}</p>
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