import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { BookOpen, CheckCircle, Clock, XCircle, AlertCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { useTranslation } from 'react-i18next';

const MyBooks = () => {
    const { t } = useTranslation();
    const [activeLoans, setActiveLoans] = useState([]);
    const [historyLoans, setHistoryLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("active");
    const navigate = useNavigate();

    const [returningId, setReturningId] = useState(null);
    const [showReturnModal, setShowReturnModal] = useState(false);
    const [selectedLoan, setSelectedLoan] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const activeRes = await axios.get("https://library-backend.onrender.com/api/loans/my-books", config);
            setActiveLoans(activeRes.data);

            const historyRes = await axios.get("https://library-backend.onrender.com/api/loans/history", config);
            setHistoryLoans(historyRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const openReturnModal = (loan) => {
        setSelectedLoan(loan);
        setShowReturnModal(true);
    };

    const closeReturnModal = () => {
        setShowReturnModal(false);
        setSelectedLoan(null);
    };

    const handleReturnBook = async () => {
        if (!selectedLoan) return;

        setReturningId(selectedLoan.id);
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            await axios.post(`https://library-backend.onrender.com/api/loans/return/${selectedLoan.id}`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            fetchData();
            closeReturnModal();

        } catch (error) {
            alert(t('my_books.return_failed', 'Failed to return book.'));
            console.error(error);
        } finally {
            setReturningId(null);
        }
    };

    const getDaysLeft = (expiryDate) => {
        const now = new Date();
        const end = new Date(expiryDate);
        const diffTime = end - now;
        if (diffTime <= 0) return 0;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 font-medium">{t('my_books.loading', 'Loading your library...')}</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 py-12">
            <div className="w-full max-w-7xl mx-auto">
                {/* Header Area */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 text-sm font-medium mb-4 transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            {t('my_books.back', 'Back')}
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl shadow-lg">
                                <BookOpen className="w-8 h-8 text-white" />
                            </div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {t('my_books.title', 'My Library')}
                            </h1>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-1.5 rounded-2xl shadow-inner border border-blue-100 inline-flex">
                        <button
                            onClick={() => setActiveTab("active")}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === "active"
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform -translate-y-0.5"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                            }`}
                        >
                            <Clock className="w-4 h-4" />
                            {t('my_books.tab_active', 'Active')} ({activeLoans.length})
                        </button>
                        <button
                            onClick={() => setActiveTab("history")}
                            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
                                activeTab === "history"
                                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform -translate-y-0.5"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
                            }`}
                        >
                            <CheckCircle className="w-4 h-4" />
                            {t('my_books.tab_history', 'History')} ({historyLoans.length})
                        </button>
                    </div>
                </div>

                {/* --- ACTIVE TAB --- */}
                {activeTab === "active" && (
                    <>
                        {activeLoans.length === 0 ? (
                            <div className="max-w-md">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20"></div>
                                    <div className="relative bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-6">
                                            <BookOpen className="w-12 h-12 text-blue-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{t('my_books.empty_active_title', 'Your Active Library Awaits')}</h3>
                                        <p className="text-gray-600 mb-8 text-center">
                                            {t('my_books.empty_active_msg', 'No active rentals yet. Start your reading journey with our focused 3-day rental system.')}
                                        </p>
                                        <div className="flex justify-center">
                                            <Link
                                                to="/books"
                                                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                            >
                                                {t('my_books.btn_browse', 'Browse Available Books')}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {activeLoans.map((loan) => {
                                    const daysLeft = getDaysLeft(loan.expiryDate);
                                    const isExpiringSoon = daysLeft <= 1;

                                    return (
                                        <div
                                            key={loan.id}
                                            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group"
                                        >
                                            <div className={`h-2 ${isExpiringSoon ? 'bg-gradient-to-r from-red-500 to-orange-500' : 'bg-gradient-to-r from-green-500 to-emerald-500'}`}></div>

                                            <div className="p-6 flex-1 flex flex-col">
                                                <Link to={`/books/${loan.book.id}`} className="hover:underline focus:outline-none">
                                                    <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors mb-1">
                                                        {loan.book.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-gray-500 text-sm mb-6">{t('my_books.by_author', 'by')} {loan.book.author}</p>

                                                <Link to={`/books/${loan.book.id}`} className="mb-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity">
                                                    <div className="w-16 h-20 bg-gradient-to-br from-blue-200 to-purple-200 rounded-lg shadow-inner flex items-center justify-center">
                                                        <BookOpen className="w-8 h-8 text-blue-500" />
                                                    </div>
                                                </Link>

                                                <div className={`mb-6 rounded-xl p-4 ${isExpiringSoon ? 'bg-gradient-to-r from-red-50 to-orange-50 border border-red-100' : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100'}`}>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-2 rounded-lg ${isExpiringSoon ? 'bg-red-100' : 'bg-green-100'}`}>
                                                                <Clock className={`w-5 h-5 ${isExpiringSoon ? 'text-red-600' : 'text-green-600'}`} />
                                                            </div>
                                                            <div>
                                                                <div className={`text-sm font-medium ${isExpiringSoon ? 'text-red-700' : 'text-green-700'}`}>
                                                                    {isExpiringSoon ? t('my_books.status_expiring', 'Expiring Soon') : t('my_books.status_days_remaining', 'Days Remaining')}
                                                                </div>
                                                                <div className="flex items-baseline gap-2">
                                                                    <span className={`text-2xl font-bold ${isExpiringSoon ? 'text-red-700' : 'text-green-700'}`}>
                                                                        {daysLeft}
                                                                    </span>
                                                                    <span className="text-gray-600">{t('my_books.days', 'days')}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-3 mt-auto">
                                                    <button
                                                        onClick={() => openReturnModal(loan)}
                                                        disabled={returningId === loan.id}
                                                        className={`flex-1 py-3 font-bold rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 ${
                                                            returningId === loan.id
                                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                                : 'bg-gradient-to-r from-red-50 to-orange-50 text-red-600 border border-red-200 hover:from-red-100 hover:to-orange-100 hover:shadow-md hover:-translate-y-0.5'
                                                        }`}
                                                    >
                                                        {returningId === loan.id ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                                                                {t('my_books.returning', 'Returning...')}
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="w-4 h-4" />
                                                                {t('my_books.btn_finish', 'Finish Book')}
                                                            </>
                                                        )}
                                                    </button>
                                                    <Link
                                                        to={`/books/${loan.book.id}`}
                                                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 text-sm flex items-center justify-center"
                                                    >
                                                        {t('my_books.btn_read_now', 'Read Now')}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                )}

                {/* --- HISTORY TAB --- */}
                {activeTab === "history" && (
                    <>
                        {historyLoans.length === 0 ? (
                            <div className="max-w-md">
                                <div className="relative mb-8">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-2xl opacity-20"></div>
                                    <div className="relative bg-white p-12 rounded-3xl shadow-xl border border-gray-100">
                                        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full mb-6">
                                            <BookOpen className="w-12 h-12 text-purple-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center">{t('my_books.empty_history_title', 'Reading History')}</h3>
                                        <p className="text-gray-600 mb-8 text-center">
                                            {t('my_books.empty_history_msg', 'Your completed books will appear here. Finish your current rentals to start building your reading history!')}
                                        </p>
                                        <div className="flex justify-center">
                                            <button
                                                onClick={() => setActiveTab("active")}
                                                className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                                            >
                                                {t('my_books.btn_view_active', 'View Active Rentals')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {historyLoans.map((loan) => (
                                    <div
                                        key={loan.id}
                                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
                                    >
                                        <div className="p-6">
                                            <div className="h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>

                                            <div className="mt-4 flex items-start gap-4">
                                                <div className="flex-shrink-0">
                                                    <div className="h-16 w-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center text-xl font-bold text-emerald-600">
                                                        {loan.book.title.charAt(0)}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <Link to={`/books/${loan.book.id}`} className="hover:underline focus:outline-none">
                                                        <h4 className="font-bold text-gray-900 text-lg group-hover:text-emerald-600 transition-colors mb-1 line-clamp-2">
                                                            {loan.book.title}
                                                        </h4>
                                                    </Link>
                                                    <p className="text-sm text-gray-500 mb-3">{t('my_books.by_author', 'by')} {loan.book.author}</p>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                                        <span>{t('my_books.completed_on', {
                                                            date: new Date(loan.expiryDate).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })
                                                        })}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-6">
                                                <Link
                                                    to={`/books/${loan.book.id}`}
                                                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-700 font-semibold rounded-xl border border-emerald-200 hover:from-emerald-100 hover:to-green-100 hover:text-emerald-800 hover:shadow-md transition-all duration-300 group/rent"
                                                >
                                                    <RotateCcw className="w-4 h-4 group-hover/rent:rotate-180 transition-transform" />
                                                    {t('my_books.btn_rent_again', 'Rent Again')}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* --- RETURN CONFIRMATION MODAL --- */}
            {showReturnModal && selectedLoan && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
                        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-8 text-white text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-black/10"></div>
                            <div className="relative z-10">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-full mb-4 backdrop-blur-sm">
                                    <CheckCircle className="w-10 h-10 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2">{t('my_books.modal_title', 'Finish Reading?')}</h3>
                                <p className="text-green-100 opacity-90">{t('my_books.modal_subtitle', 'Confirm you\'ve completed this book')}</p>
                            </div>
                        </div>

                        <div className="p-8">
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl mb-4">
                                    <BookOpen className="w-8 h-8 text-blue-600" />
                                </div>
                                <h4 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
                                    {selectedLoan.book.title}
                                </h4>
                                <p className="text-gray-600">{t('my_books.by_author', 'by')} {selectedLoan.book.author}</p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100 mb-6">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-sm text-gray-700">
                                        <p className="font-medium text-gray-900 mb-1">{t('my_books.modal_info_title', 'What happens next:')}</p>
                                        <ul className="space-y-1">
                                            <li className="flex items-center gap-2">✓ {t('my_books.modal_point_1', 'Book moves to your history')}</li>
                                            <li className="flex items-center gap-2">✓ {t('my_books.modal_point_2', 'You can now rent another book')}</li>
                                            <li className="flex items-center gap-2">✓ {t('my_books.modal_point_3', 'Reading progress will be saved')}</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">{t('my_books.status_days_remaining', 'Days Remaining')}</div>
                                    <div className="text-2xl font-bold text-gray-900">{getDaysLeft(selectedLoan.expiryDate)}</div>
                                </div>
                                <div className="h-12 w-px bg-gray-200"></div>
                                <div className="text-center">
                                    <div className="text-sm text-gray-500">{t('my_books.modal_price_label', 'Rental Price')}</div>
                                    <div className="text-2xl font-bold text-gray-900">$5</div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={closeReturnModal}
                                    className="flex-1 py-3.5 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                                >
                                    <XCircle className="w-5 h-5" />
                                    {t('my_books.btn_cancel', 'Cancel')}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReturnBook}
                                    disabled={returningId === selectedLoan.id}
                                    className={`flex-1 py-3.5 font-bold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 ${
                                        returningId === selectedLoan.id
                                            ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed'
                                            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:shadow-lg hover:-translate-y-0.5'
                                    }`}
                                >
                                    {returningId === selectedLoan.id ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {t('my_books.returning', 'Returning...')}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            {t('my_books.btn_confirm', 'Yes, I Finished It')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default MyBooks;