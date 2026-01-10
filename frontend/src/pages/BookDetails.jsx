import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { BookOpen, Clock, Star, User, MessageSquare, CheckCircle, AlertCircle, ArrowLeft, History, X, Info, AlertTriangle } from "lucide-react";
import StarRating from "../components/StarRating";
import { useTranslation } from 'react-i18next';

const BookDetails = () => {
    const { t } = useTranslation();
    const { id } = useParams();
    const navigate = useNavigate();

    // --- State ---
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [renting, setRenting] = useState(false);

    // --- New Logic State ---
    const [activeLoan, setActiveLoan] = useState(false); // Do I have it NOW?
    const [historyData, setHistoryData] = useState(null); // Have I read it BEFORE?

    const [reviews, setReviews] = useState([]);
    const [userRating, setUserRating] = useState(0);
    const [userComment, setUserComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [myExistingReview, setMyExistingReview] = useState(null); // Did I review it already?

    // --- New: Alert State ---
    const [showAlert, setShowAlert] = useState(false);
    const [alertTitle, setAlertTitle] = useState("");
    const [alertMessage, setAlertMessage] = useState("");
    const [alertType, setAlertType] = useState("info"); // info, success, warning, error

    // Auth Helpers
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const currentUsername = localStorage.getItem("username") || sessionStorage.getItem("username");
    const isLoggedIn = !!token;

    // --- Show Alert Function ---
    const showCustomAlert = (title, message, type = "info") => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType(type);
        setShowAlert(true);
    };

    // --- Hide Alert ---
    const hideAlert = () => {
        setShowAlert(false);
        setTimeout(() => {
            setAlertTitle("");
            setAlertMessage("");
            setAlertType("info");
        }, 300);
    };

    // --- Confirm Dialog ---
    const showConfirmDialog = (title, message, onConfirm) => {
        setAlertTitle(title);
        setAlertMessage(message);
        setAlertType("confirm");
        setShowAlert(true);

        // Store the confirm callback
        const confirmCallback = () => {
            onConfirm();
            hideAlert();
        };

        // We'll handle this in the alert modal
        window.confirmCallback = confirmCallback;
    };

    useEffect(() => {
        const loadAllData = async () => {
            try {
                // 1. Fetch Book Details
                const bookRes = await axios.get(`http://localhost:8080/api/books/${id}`);
                setBook(bookRes.data);

                // 2. Fetch Reviews for this book
                const reviewsRes = await axios.get(`http://localhost:8080/api/reviews/book/${id}`);
                setReviews(reviewsRes.data);

                // 3. IF LOGGED IN: Run User Specific Checks
                if (isLoggedIn) {
                    // A. Check if user already wrote a review
                    const myReview = reviewsRes.data.find(r => r.username === currentUsername);
                    setMyExistingReview(myReview);

                    // B. Check for ACTIVE rental (server check)
                    try {
                        const activeRes = await axios.get(`http://localhost:8080/api/loans/check/${id}`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setActiveLoan(activeRes.data);
                    } catch (err) {
                        // Silent fail - don't show alert
                    }

                    // C. Check HISTORY (fetch all history and find this book)
                    try {
                        const historyRes = await axios.get(`http://localhost:8080/api/loans/history`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const pastRead = historyRes.data.find(loan => loan.book.id === parseInt(id));
                        setHistoryData(pastRead);
                    } catch (err) {
                        // Silent fail - don't show alert
                    }
                }

            } catch (error) {
                console.error("Error loading book:", error);
                // If book doesn't exist, setBook to null to show "Book not found" page
                if (error.response?.status === 404) {
                    setBook(null);
                }
            } finally {
                setLoading(false);
            }
        };

        loadAllData();
    }, [id, isLoggedIn, currentUsername, token]);

    // --- Action: Rent Book ---
    const handleRent = async () => {
        if (!isLoggedIn) {
            navigate("/login");
            return;
        }

        if (activeLoan) {
            showCustomAlert(t('alerts.already_rented_title'), t('alerts.already_rented_msg'), "warning");
            return;
        }

        // Show custom confirmation dialog
        showConfirmDialog(
            t('alerts.rent_confirm_title', { title: book.title }),
            t('alerts.rent_confirm_msg'),
            async () => {
                setRenting(true);
                try {
                    await axios.post(`http://localhost:8080/api/loans/rent/${book.id}`, {}, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    showCustomAlert(t('alerts.rent_success_title'), t('alerts.rent_success_msg'), "success");
                    setActiveLoan(true); // Update UI immediately

                    // Refresh book to update availability if needed
                    const updatedBook = await axios.get(`http://localhost:8080/api/books/${id}`);
                    setBook(updatedBook.data);

                } catch (error) {
                    const msg = error.response?.data?.message || t('alerts.generic_error');
                    showCustomAlert(t('alerts.rent_failed_title'), t('alerts.rent_failed_msg', { error: msg }), "error");
                } finally {
                    setRenting(false);
                }
            }
        );
    };

    // --- Action: Submit Review ---
    const handleSubmitReview = async (e) => {
        e.preventDefault();

        if (myExistingReview) {
            showCustomAlert(t('alerts.already_reviewed_title'), t('alerts.already_reviewed_msg'), "warning");
            return;
        }
        if (userRating === 0) {
            showCustomAlert(t('alerts.rating_required_title'), t('alerts.rating_required_msg'), "info");
            return;
        }

        setSubmittingReview(true);
        try {
            await axios.post("http://localhost:8080/api/reviews/add", {
                bookId: book.id,
                rating: userRating,
                comment: userComment
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Reload reviews to show the new one
            const res = await axios.get(`http://localhost:8080/api/reviews/book/${id}`);
            setReviews(res.data);
            setMyExistingReview(res.data.find(r => r.username === currentUsername));

            // Clear form
            setUserRating(0);
            setUserComment("");
            showCustomAlert(t('alerts.review_success_title'), t('alerts.review_success_msg'), "success");

        } catch (error) {
            showCustomAlert(t('alerts.review_failed_title'), t('alerts.review_failed_msg', { error: error.response?.data || t('alerts.generic_error') }), "error");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600 font-medium">{t('book_details.loading')}</p>
            </div>
        </div>
    );

    if (!book) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('book_details.book_not_found')}</h2>
                <p className="text-gray-600 mb-4">{t('book_details.book_not_found_msg')}</p>
                <button
                    onClick={() => navigate('/books')}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {t('book_details.btn_browse_books')}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-gray-600 hover:text-blue-600 mb-8 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    {t('book_details.back_btn')}
                </button>

                {/* --- Main Book Card --- */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row relative">

                    {/* User Status Badges (Top Right Overlay) */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
                        {activeLoan && (
                            <span className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                                <Clock className="w-4 h-4 mr-2" />
                                {t('book_details.badge_rented')}
                            </span>
                        )}
                        {historyData && !activeLoan && (
                            <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {t('book_details.badge_read_on', { date: new Date(historyData.expiryDate).toLocaleDateString() })}
                            </span>
                        )}
                    </div>

                    {/* Left: Cover */}
                    <div className="md:w-1/3 bg-gradient-to-br from-gray-900 to-blue-900 p-8 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                        <div className="relative z-10 w-48 h-72 bg-white rounded-r-lg shadow-2xl flex flex-col transform hover:scale-105 transition-transform duration-300">
                            <div className="absolute left-0 top-0 bottom-0 w-4 bg-gray-200/50 z-20"></div>
                            <div className="flex-1 p-4 flex items-center justify-center bg-gradient-to-br from-gray-50 to-blue-50">
                                <BookOpen className="w-16 h-16 text-blue-500" />
                            </div>
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div className="md:w-2/3 p-8 md:p-12 flex flex-col">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 mb-2">{book.title}</h1>
                                <p className="text-xl text-gray-600 font-medium">{t('books.by_author')} {book.author}</p>
                            </div>
                        </div>

                        {/* Meta Data */}
                        <div className="flex flex-wrap gap-3 mb-8">
                            <span className="px-4 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm font-semibold border border-blue-200">
                                {book.category}
                            </span>
                            <div className="flex items-center bg-gradient-to-r from-yellow-50 to-amber-50 px-4 py-1.5 rounded-full border border-yellow-100">
                                <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                                <span className="font-bold text-gray-900">{book.averageRating || "0.0"}</span>
                                <span className="text-xs text-gray-500 ml-1">({book.totalVotes} {t('books.votes')})</span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="prose text-gray-600 mb-8 flex-1">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-2">{t('book_details.synopsis')}</h3>
                            <p className="leading-relaxed text-gray-700">{book.description || t('book_details.no_description')}</p>
                        </div>

                        {/* Action Bar */}
                        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                            <div className="text-gray-500 text-sm">
                                {historyData ? (
                                    <span className="flex items-center text-purple-600 font-medium">
                                        <History className="w-4 h-4 mr-2" />
                                        {t('book_details.msg_finished')}
                                    </span>
                                ) : (
                                    <span className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {t('book_details.rental_period')}
                                    </span>
                                )}
                            </div>

                            {/* Logic for Buttons */}
                            {activeLoan ? (
                                <Link
                                    to="/my-books"
                                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                >
                                    {t('book_details.btn_continue_reading')}
                                </Link>
                            ) : historyData ? (
                                <button
                                    onClick={handleRent}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 flex items-center"
                                >
                                    <BookOpen className="w-4 h-4 mr-2" />
                                    {t('book_details.btn_rent_again')}
                                </button>
                            ) : !book.available ? (
                                <button disabled className="px-8 py-3 bg-gradient-to-r from-gray-100 to-gray-200 text-gray-400 font-bold rounded-xl cursor-not-allowed shadow-inner">
                                    {t('book_details.status_unavailable')}
                                </button>
                            ) : (
                                <button
                                    onClick={handleRent}
                                    disabled={renting}
                                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {renting ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            {t('book_details.btn_processing')}
                                        </>
                                    ) : t('book_details.btn_rent')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* --- REVIEWS SECTION --- */}
                <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Review Form (Or 'Already Reviewed' Message) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                                {t('book_details.reviews_title')}
                            </h3>

                            {!isLoggedIn ? (
                                <div className="text-center py-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <User className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <p className="text-gray-500 mb-3">{t('book_details.login_to_rate')}</p>
                                    <Link to="/login" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:shadow-md transition-all">
                                        {t('book_details.btn_sign_in')}
                                    </Link>
                                </div>
                            ) : myExistingReview ? (
                                // STATE: ALREADY REVIEWED
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100 text-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-green-100 to-emerald-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <CheckCircle className="w-6 h-6" />
                                    </div>
                                    <h4 className="text-gray-900 font-bold mb-1">{t('book_details.review_thanks')}</h4>
                                    <p className="text-sm text-gray-600 mb-3">{t('book_details.you_rated')}</p>
                                    <div className="flex justify-center mb-4">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`w-5 h-5 ${i < myExistingReview.rating ? "text-yellow-400 fill-current" : "text-gray-200"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 italic">{t('book_details.review_no_edit')}</p>
                                </div>
                            ) : (
                                // STATE: CAN WRITE REVIEW
                                <form onSubmit={handleSubmitReview}>
                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('book_details.your_rating')}</label>
                                        <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-4 rounded-xl border border-gray-200">
                                            <StarRating
                                                rating={userRating}
                                                onRate={setUserRating}
                                                editable={true}
                                            />
                                            <p className="text-xs text-gray-500 mt-2 text-center">
                                                {userRating === 0
                                                    ? t('book_details.tap_stars')
                                                    : t(userRating === 1 ? 'book_details.you_selected_stars' : 'book_details.you_selected_stars_plural', { count: userRating })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">{t('book_details.review_comment_label')}</label>
                                        <textarea
                                            rows="4"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-gray-50/50 transition-all focus:bg-white"
                                            placeholder={t('book_details.review_comment_placeholder')}
                                            value={userComment}
                                            onChange={(e) => setUserComment(e.target.value)}
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submittingReview || userRating === 0}
                                        className="w-full py-3.5 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold rounded-xl hover:from-gray-800 hover:to-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg flex items-center justify-center"
                                    >
                                        {submittingReview ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                                {t('book_details.btn_posting')}
                                            </>
                                        ) : t('book_details.btn_post_review')}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* Community Reviews List */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">{t('book_details.community_feedback')}</h3>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                {t(reviews.length === 1 ? 'book_details.reviews_count' : 'book_details.reviews_count_plural', { count: reviews.length })}
                            </span>
                        </div>

                        {reviews.length === 0 ? (
                            <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-10 text-center border border-gray-200">
                                <div className="w-16 h-16 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MessageSquare className="w-8 h-8 text-gray-400" />
                                </div>
                                <h4 className="text-gray-900 font-bold mb-2">{t('book_details.no_reviews_title')}</h4>
                                <p className="text-gray-500 max-w-md mx-auto">
                                    {t('book_details.no_reviews_msg')}
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {reviews.map((review) => (
                                    <div key={review.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
                                                    {review.username.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="ml-3">
                                                    <p className="font-bold text-gray-900 text-sm">
                                                        {review.username === currentUsername ? t('book_details.you') : review.username}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {new Date(review.date).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-current" : "text-gray-200"}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <div className="mt-3 text-gray-600 text-sm leading-relaxed bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                                                "{review.comment}"
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- BEAUTIFUL ALERT MODAL --- */}
            {showAlert && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn">
                        {/* Modal Header */}
                        <div className={`p-6 text-white text-center ${
                            alertType === 'success'
                                ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                                : alertType === 'error'
                                    ? 'bg-gradient-to-r from-red-500 to-rose-600'
                                    : alertType === 'warning'
                                        ? 'bg-gradient-to-r from-amber-500 to-orange-600'
                                        : alertType === 'confirm'
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600'
                                            : 'bg-gradient-to-r from-blue-500 to-indigo-600'
                        }`}>
                            <div className="flex items-center justify-center gap-3 mb-2">
                                {alertType === 'success' ? (
                                    <CheckCircle className="h-8 w-8 text-white" />
                                ) : alertType === 'error' ? (
                                    <AlertTriangle className="h-8 w-8 text-white" />
                                ) : alertType === 'warning' ? (
                                    <AlertCircle className="h-8 w-8 text-white" />
                                ) : alertType === 'confirm' ? (
                                    <Info className="h-8 w-8 text-white" />
                                ) : (
                                    <Info className="h-8 w-8 text-white" />
                                )}
                                <h3 className="text-2xl font-bold">{alertTitle}</h3>
                            </div>
                            <button
                                onClick={hideAlert}
                                className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 text-center">
                            <p className="text-gray-700 mb-8 leading-relaxed">{alertMessage}</p>

                            {/* Action Buttons */}
                            <div className={`flex gap-3 ${alertType === 'confirm' ? '' : 'justify-center'}`}>
                                {alertType === 'confirm' ? (
                                    <>
                                        <button
                                            onClick={hideAlert}
                                            className="flex-1 py-3 border-2 border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <X className="w-4 h-4" />
                                            {t('alerts.btn_cancel')}
                                        </button>
                                        <button
                                            onClick={() => {
                                                if (window.confirmCallback) {
                                                    window.confirmCallback();
                                                }
                                                hideAlert();
                                            }}
                                            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-purple-700 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            {t('alerts.btn_confirm')}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={hideAlert}
                                        className={`px-12 py-3 font-bold rounded-xl transition-all duration-300 ${
                                            alertType === 'success'
                                                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'
                                                : alertType === 'error'
                                                    ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700'
                                                    : alertType === 'warning'
                                                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white hover:from-amber-600 hover:to-orange-700'
                                                        : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700'
                                        }`}
                                    >
                                        {t('alerts.btn_continue')}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Add CSS for fade-in animation */}
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

export default BookDetails;