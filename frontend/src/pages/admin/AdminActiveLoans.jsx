import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const AdminActiveLoans = () => {
    const { t } = useTranslation();
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLoans();
    }, []);

    const fetchLoans = async () => {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const response = await axios.get("http://localhost:8080/api/loans/admin/active", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setLoans(response.data);
        } catch (error) {
            console.error("Error fetching loans:", error);
            alert(t('admin.loans_fetch_error', 'Failed to load active loans.'));
        } finally {
            setLoading(false);
        }
    };

    const getStatus = (expiryDate) => {
        const now = new Date();
        const end = new Date(expiryDate);
        return end > now ? t('admin.loan_status_active', 'Active') : t('admin.loan_status_expired', 'Expired');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    if (loading) return <div className="text-center py-20">{t('admin.loading_rentals', 'Loading rentals...')}</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">{t('admin.loans_title', 'Active Digital Rentals')}</h1>
                        <p className="text-gray-500 mt-1">{t('admin.loans_subtitle', 'Monitor currently borrowed books and expiration times.')}</p>
                    </div>
                    <Link to="/admin/dashboard" className="text-blue-600 hover:underline">
                        ← {t('admin.back_to_dashboard', 'Back to Dashboard')}
                    </Link>
                </div>

                {/* Loans Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                            <th className="py-4 px-6 font-bold">{t('admin.loan_table_user', 'User')}</th>
                            <th className="py-4 px-6 font-bold">{t('admin.loan_table_book', 'Book Title')}</th>
                            <th className="py-4 px-6 font-bold">{t('admin.loan_table_date', 'Rented On')}</th>
                            <th className="py-4 px-6 font-bold">{t('admin.loan_table_expiry', 'Expires')}</th>
                            <th className="py-4 px-6 font-bold">{t('admin.loan_table_price', 'Price')}</th>
                            <th className="py-4 px-6 font-bold">{t('admin.loan_table_status', 'Status')}</th>
                        </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm">
                        {loans.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="py-10 text-center text-gray-500">
                                    {t('admin.no_active_rentals', 'No active rentals found.')}
                                </td>
                            </tr>
                        ) : (
                            loans.map((loan) => {
                                const status = getStatus(loan.expiryDate);
                                return (
                                    <tr key={loan.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="font-bold text-gray-800">{loan.user.username}</div>
                                            <div className="text-xs text-gray-500">{loan.user.email}</div>
                                        </td>
                                        <td className="py-4 px-6 font-medium text-blue-600">
                                            {loan.book.title}
                                        </td>
                                        <td className="py-4 px-6">{formatDate(loan.loanDate)}</td>
                                        <td className="py-4 px-6 font-mono text-gray-700">
                                            {formatDate(loan.expiryDate)}
                                        </td>
                                        <td className="py-4 px-6 font-bold text-green-600">
                                            ${loan.price.toFixed(2)}
                                        </td>
                                        <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                                    status === t('admin.loan_status_active', 'Active')
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-100 text-red-800"
                                                }`}>
                                                    {status}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminActiveLoans;