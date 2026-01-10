import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";
import { Eye, EyeOff, CheckCircle, XCircle, AlertCircle, Camera, ShieldCheck, AlertTriangle, UserCheck } from "lucide-react";

const UserProfile = () => {
    const { t } = useTranslation();

    // --- STATE ---
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loanCount, setLoanCount] = useState(0);
    const [historyCount, setHistoryCount] = useState(0);
    const [gradientIndex, setGradientIndex] = useState(0);
    const navigate = useNavigate();

    // --- File Upload State ---
    const fileInputRef = useRef(null);
    const [isAiScanning, setIsAiScanning] = useState(false);

    // --- Edit Modal State ---
    const [showEditModal, setShowEditModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        username: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState("");

    // --- Alert Modal State ---
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState({});

    // --- Validation States ---
    const [usernameError, setUsernameError] = useState("");
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const [usernameLoading, setUsernameLoading] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false, uppercase: false, lowercase: false, number: false
    });

    // Dynamic gradients
    const gradients = [
        "from-indigo-900 via-blue-900 to-purple-900",
        "from-blue-900 via-indigo-900 to-purple-900",
        "from-purple-900 via-blue-900 to-indigo-900",
        "from-blue-900 via-purple-900 to-indigo-900",
        "from-indigo-800 via-blue-800 to-purple-800",
        "from-purple-800 via-indigo-800 to-blue-800"
    ];

    // --- FETCH DATA ---
    useEffect(() => {
        const interval = setInterval(() => {
            setGradientIndex((prev) => (prev + 1) % gradients.length);
        }, 5000);
        fetchProfileData();
        return () => clearInterval(interval);
    }, [navigate]);

    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            if (!token) { navigate("/login"); return; }
            const config = { headers: { Authorization: `Bearer ${token}` } };

            const userRes = await axios.get("http://library-backend.onrender.com/api/users/me", config);
            setUser(userRes.data);
            setEditFormData(prev => ({ ...prev, username: userRes.data.username }));

            const loansRes = await axios.get("http://library-backend.onrender.com/api/loans/my-books", config);
            setLoanCount(loansRes.data.length);

            const historyRes = await axios.get("http://library-backend.onrender.comF/api/loans/history", config);
            setHistoryCount(historyRes.data.length);
        } catch (error) {
            console.error("Error:", error);
            navigate("/login");
        } finally {
            setLoading(false);
        }
    };

    // --- HANDLE FILE UPLOAD ---
    const handleFileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // File type validation
        if (!file.type.startsWith('image/')) {
            showAlertMessage(t('profile.upload_error'), t('profile.invalid_image'), "error");
            return;
        }

        // File size validation (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showAlertMessage(t('profile.upload_error'), t('profile.file_too_large'), "error");
            return;
        }

        setIsAiScanning(true);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const res = await axios.post("http://library-backend.onrender.com/api/users/upload-photo", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });

            setUser(res.data);
            showAlertMessage(t('profile.success'), t('profile.upload_success'), "success");

        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || t('profile.upload_failed');
            showAlertMessage(t('profile.upload_error'), errorMsg, "error");
        } finally {
            setIsAiScanning(false);
            if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    // --- Show Alert Message ---
    const showAlertMessage = (title, message, type) => {
        setAlertMessage({
            title: title,
            message: message,
            type: type
        });
        setShowAlert(true);
    };

    // --- VALIDATION HELPERS ---
    const checkUsernameAvailability = async (username) => {
        if (!username || username === user?.username) {
            setIsUsernameAvailable(null);
            setUsernameError("");
            return;
        }

        if (username.length < 3) {
            setUsernameError(t('profile.username_min_length'));
            setIsUsernameAvailable(false);
            return;
        }

        setUsernameLoading(true);
        try {
            const response = await axios.get(`http://library-backend.onrender.com/api/users/check-username?username=${encodeURIComponent(username)}`);

            if (response.data.available) {
                setIsUsernameAvailable(true);
                setUsernameError("");
            } else {
                setIsUsernameAvailable(false);
                setUsernameError(t('profile.username_taken'));
            }
        } catch (error) {
            console.error("Username check failed", error);
            setIsUsernameAvailable(null);
            setUsernameError("");
        } finally {
            setUsernameLoading(false);
        }
    };

    const validatePassword = (password) => {
        setPasswordRequirements({
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /[0-9]/.test(password)
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditFormData({ ...editFormData, [name]: value });
        if (name === 'username') checkUsernameAvailability(value);
        if (name === 'newPassword') validatePassword(value);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setUpdateError("");

        if (editFormData.newPassword !== editFormData.confirmPassword) {
            setUpdateError(t('profile.passwords_mismatch'));
            setUpdateLoading(false);
            return;
        }

        if (editFormData.username !== user?.username && isUsernameAvailable === false) {
            setUpdateError(t('profile.username_taken'));
            setUpdateLoading(false);
            return;
        }

        try {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");
            const payload = {
                username: editFormData.username
            };

            if (editFormData.newPassword) {
                if (!editFormData.currentPassword) {
                    setUpdateError(t('profile.current_password_required'));
                    setUpdateLoading(false);
                    return;
                }
                payload.currentPassword = editFormData.currentPassword;
                payload.newPassword = editFormData.newPassword;
            }

            const res = await axios.put("http://library-backend.onrender.com/api/users/me", payload, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setUser(res.data);
            setShowEditModal(false);

            showAlertMessage(t('profile.success'), t('profile.update_success'), "success");

            setEditFormData(prev => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));

        } catch (err) {
            if (err.response?.status === 409) {
                setUpdateError(t('profile.username_taken'));
            } else if (err.response?.status === 429) {
                setUpdateError(t('profile.too_many_attempts'));
            } else {
                setUpdateError(err.response?.data?.message || t('profile.update_failed'));
            }
        } finally {
            setUpdateLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowEditModal(false);
        setUsernameError("");
        setIsUsernameAvailable(null);
        setUpdateError("");
        setEditFormData({
            username: user?.username || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: ""
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
                <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
                    <p className="mt-4 text-gray-600 font-medium">{t('profile.loading')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Page Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('profile.title')}</h1>
                    <p className="text-gray-600">{t('profile.subtitle')}</p>
                </div>

                {/* Profile Header Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-8 relative">
                    <div className={`h-40 bg-gradient-to-r ${gradients[gradientIndex]} transition-all duration-1000 ease-in-out`}></div>

                    <div className="relative px-8 pb-8">
                        {/* --- PROFILE PICTURE SECTION --- */}
                        <div className="absolute -top-20 left-8 flex flex-col items-center">

                            {/* Avatar Circle */}
                            <div className="relative">
                                <div className="h-40 w-40 rounded-full border-8 border-white bg-white shadow-2xl flex items-center justify-center overflow-hidden relative">
                                    {isAiScanning ? (
                                        // AI Scanning Overlay
                                        <div className="absolute inset-0 bg-black/60 z-10 flex flex-col items-center justify-center text-white">
                                            <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-400 border-t-transparent mb-2"></div>
                                            <span className="text-xs font-bold animate-pulse flex items-center">
                                                <ShieldCheck className="w-3 h-3 mr-1"/> {t('profile.ai_scanning')}
                                            </span>
                                        </div>
                                    ) : null}

                                    {user?.profilePicUrl ? (
                                        <img src={user.profilePicUrl} alt="Profile" className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                            <span className="text-6xl font-bold text-blue-600 uppercase">{user?.username?.charAt(0)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Upload Button (Camera Icon) - Always enabled */}
                                <button
                                    onClick={() => fileInputRef.current.click()}
                                    disabled={isAiScanning}
                                    className={`absolute bottom-2 right-2 ${isAiScanning ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'} text-white p-2.5 rounded-full shadow-lg border-4 border-white transition-all transform hover:scale-110 cursor-pointer`}
                                    title={t('profile.change_picture')}
                                >
                                    <Camera className="w-5 h-5" />
                                </button>
                                {/* Hidden Input */}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="px-8 pb-8 pt-24">
                        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user?.username}</h1>
                                <div className="flex items-center text-gray-600 mb-4">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <p className="text-lg">{user?.email}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-green-50 to-green-100 text-green-800 border border-green-200">
                                    <UserCheck className="w-4 h-4 mr-2" />
                                    {t('profile.active_member')}
                                </span>
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 border border-blue-200">
                                    <ShieldCheck className="w-4 h-4 mr-2" />
                                    {user?.role}
                                </span>
                            </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <p className="text-sm text-gray-500">
                                <span className="font-medium">{t('profile.member_since')}:</span> {t('profile.joined', {
                                date: new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })
                            })}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Stats / Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center">
                                <div className="mr-3 p-2 bg-blue-50 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                {t('profile.account_details')}
                            </h2>
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="text-sm text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                {t('profile.btn_edit')}
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">{t('profile.user_id')}</p>
                                    <p className="font-medium text-gray-900">{user?.id}</p>
                                </div>
                                <span className="text-xs font-mono bg-gray-100 px-3 py-1 rounded-full text-gray-600">{t('profile.unique')}</span>
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">{t('profile.label_username')}</p>
                                    <p className="font-medium text-gray-900">{user?.username}</p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">{t('profile.label_email')}</p>
                                    <p className="font-medium text-gray-900">{user?.email}</p>
                                </div>
                                <CheckCircle className="w-5 h-5 text-green-500" />
                            </div>

                            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                <div>
                                    <p className="text-sm text-gray-500">{t('profile.account_status')}</p>
                                    <p className="font-medium text-green-600">{t('profile.verified_active')}</p>
                                </div>
                                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <div className="mr-3 p-2 bg-purple-50 rounded-lg">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                </svg>
                            </div>
                            {t('profile.reading_stats')}
                        </h2>

                        <div className="space-y-6">
                            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
                                <div className="text-4xl font-bold text-blue-600 mb-2">{historyCount}</div>
                                <p className="text-sm text-blue-700 font-medium">{t('profile.stat_read')}</p>
                            </div>

                            <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl border border-purple-200">
                                <div className="text-4xl font-bold text-purple-600 mb-2">{loanCount}</div>
                                <p className="text-sm text-purple-700 font-medium">{t('profile.stat_active')}</p>
                            </div>

                            <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-2xl border border-indigo-200">
                                <div className="text-4xl font-bold text-indigo-600 mb-2">0</div>
                                <p className="text-sm text-indigo-700 font-medium">{t('profile.books_saved')}</p>
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/books')}
                            className="w-full mt-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
                        >
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                                </svg>
                                {t('profile.explore_books')}
                            </span>
                        </button>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">{t('profile.quick_actions')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => setShowEditModal(true)}
                            className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 group"
                        >
                            <div className="flex items-center">
                                <div className="mr-3 p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">{t('profile.change_password')}</p>
                                    <p className="text-sm text-gray-500">{t('profile.update_security')}</p>
                                </div>
                            </div>
                        </button>

                        <button
                            onClick={() => navigate('/my-books')}
                            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all duration-200 group relative overflow-hidden"
                        >
                            <div className="relative z-10 flex items-center">
                                <div className="mr-3 p-2 bg-blue-600 text-white rounded-lg shadow-md group-hover:scale-110 transition-transform">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-bold text-blue-900">{t('profile.open_library')}</p>
                                    <p className="text-sm text-blue-700">{t('profile.access_rented')}</p>
                                </div>
                            </div>
                        </button>

                        <button onClick={() => navigate('/Support')} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-200 transition-all duration-200 group">
                            <div className="flex items-center">
                                <div className="mr-3 p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-200">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-medium text-gray-900">{t('profile.support')}</p>
                                    <p className="text-sm text-gray-500">{t('profile.get_help')}</p>
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            {/* EDIT PROFILE MODAL */}
            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-fadeIn max-h-[90vh] overflow-y-auto">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center">
                            <h3 className="text-2xl font-bold">{t('profile.edit_profile')}</h3>
                        </div>

                        {/* --- SHOW FORM (No cooldown check) --- */}
                        <form onSubmit={handleUpdateSubmit} className="p-6 space-y-4">
                            {updateError && (
                                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center">
                                    {updateError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('profile.label_username')}</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={editFormData.username}
                                    onChange={handleEditChange}
                                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none ${
                                        usernameError ? 'border-red-300' :
                                            isUsernameAvailable === true ? 'border-green-300' :
                                                isUsernameAvailable === false ? 'border-red-300' :
                                                    'border-gray-300'
                                    }`}
                                />
                                <div className="mt-2">
                                    {usernameLoading ? (
                                        <div className="flex items-center text-sm text-gray-500">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500 mr-2"></div>
                                            {t('profile.checking_username')}
                                        </div>
                                    ) : usernameError ? (
                                        <div className="flex items-center text-sm text-red-600">
                                            <XCircle className="w-4 h-4 mr-1" />
                                            {usernameError}
                                        </div>
                                    ) : isUsernameAvailable === true ? (
                                        <div className="flex items-center text-sm text-green-600">
                                            <CheckCircle className="w-4 h-4 mr-1" />
                                            {t('profile.username_available')}
                                        </div>
                                    ) : editFormData.username !== user?.username && editFormData.username.length > 0 && (
                                        <div className="text-sm text-gray-500">
                                            {t('profile.enter_3_chars')}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t pt-4 mt-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <AlertCircle className="w-4 h-4 text-gray-500" />
                                    <p className="text-xs text-gray-500 uppercase font-bold">{t('profile.change_password_optional')}</p>
                                </div>

                                <div className="space-y-3">
                                    {/* Current Password */}
                                    <div className="relative">
                                        <input
                                            type={showCurrentPassword ? "text" : "password"}
                                            name="currentPassword"
                                            placeholder={t('profile.label_current_pass')}
                                            value={editFormData.currentPassword}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showCurrentPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* New Password */}
                                    <div className="relative">
                                        <input
                                            type={showNewPassword ? "text" : "password"}
                                            name="newPassword"
                                            placeholder={t('profile.label_new_pass')}
                                            value={editFormData.newPassword}
                                            onChange={handleEditChange}
                                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowNewPassword(!showNewPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showNewPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Requirements */}
                                    {editFormData.newPassword && (
                                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                                            <p className="text-xs font-medium text-gray-700 mb-2">{t('profile.password_requirements')}:</p>
                                            <div className="space-y-1">
                                                <div className="flex items-center text-xs">
                                                    {passwordRequirements.length ? (
                                                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3 text-red-500 mr-2" />
                                                    )}
                                                    <span className={passwordRequirements.length ? "text-green-600" : "text-gray-600"}>
                                                        {t('profile.requirement_length')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    {passwordRequirements.uppercase ? (
                                                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3 text-red-500 mr-2" />
                                                    )}
                                                    <span className={passwordRequirements.uppercase ? "text-green-600" : "text-gray-600"}>
                                                        {t('profile.requirement_uppercase')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    {passwordRequirements.lowercase ? (
                                                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3 text-red-500 mr-2" />
                                                    )}
                                                    <span className={passwordRequirements.lowercase ? "text-green-600" : "text-gray-600"}>
                                                        {t('profile.requirement_lowercase')}
                                                    </span>
                                                </div>
                                                <div className="flex items-center text-xs">
                                                    {passwordRequirements.number ? (
                                                        <CheckCircle className="w-3 h-3 text-green-500 mr-2" />
                                                    ) : (
                                                        <XCircle className="w-3 h-3 text-red-500 mr-2" />
                                                    )}
                                                    <span className={passwordRequirements.number ? "text-green-600" : "text-gray-600"}>
                                                        {t('profile.requirement_number')}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Confirm Password */}
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            placeholder={t('profile.label_confirm_pass')}
                                            value={editFormData.confirmPassword}
                                            onChange={handleEditChange}
                                            className={`w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm ${
                                                editFormData.newPassword && editFormData.confirmPassword &&
                                                editFormData.newPassword !== editFormData.confirmPassword
                                                    ? 'border-red-300'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>

                                    {/* Password Match Indicator */}
                                    {editFormData.newPassword && editFormData.confirmPassword && (
                                        <div className="mt-2">
                                            {editFormData.newPassword === editFormData.confirmPassword ? (
                                                <div className="flex items-center text-sm text-green-600">
                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                    {t('profile.passwords_match')}
                                                </div>
                                            ) : (
                                                <div className="flex items-center text-sm text-red-600">
                                                    <XCircle className="w-4 h-4 mr-1" />
                                                    {t('profile.passwords_mismatch')}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    {t('profile.cancel')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={updateLoading || (editFormData.username !== user?.username && isUsernameAvailable === false)}
                                    className={`flex-1 py-3 font-semibold rounded-xl flex justify-center items-center transition-all ${
                                        updateLoading || (editFormData.username !== user?.username && isUsernameAvailable === false)
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                                    }`}
                                >
                                    {updateLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                                    ) : t('profile.btn_save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* --- ALERT MODAL (for success/error messages) --- */}
            {showAlert && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-slideUp">
                        {/* Modal Header */}
                        <div className={`p-6 text-white text-center ${
                            alertMessage.type === 'success'
                                ? 'bg-gradient-to-r from-green-600 to-emerald-600'
                                : alertMessage.type === 'error'
                                    ? 'bg-gradient-to-r from-red-600 to-rose-600'
                                    : 'bg-gradient-to-r from-blue-600 to-purple-600'
                        }`}>
                            <div className="flex items-center justify-center gap-3 mb-2">
                                {alertMessage.type === 'success' ? (
                                    <CheckCircle className="h-8 w-8 text-white" />
                                ) : alertMessage.type === 'error' ? (
                                    <AlertTriangle className="h-8 w-8 text-white" />
                                ) : (
                                    <ShieldCheck className="h-8 w-8 text-white" />
                                )}
                                <h3 className="text-2xl font-bold">{alertMessage.title || t('profile.alert')}</h3>
                            </div>
                            <p className="opacity-90">
                                {alertMessage.type === 'success'
                                    ? t('profile.success')
                                    : alertMessage.type === 'error'
                                        ? t('profile.error')
                                        : t('profile.notice')
                                }
                            </p>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 text-center">
                            {alertMessage.type === 'success' ? (
                                <>
                                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 mb-6">
                                        <CheckCircle className="h-10 w-10 text-green-500" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-3">{alertMessage.message}</h4>
                                    <p className="text-gray-600 mb-6">
                                        {t('profile.changes_saved')}
                                    </p>
                                </>
                            ) : alertMessage.type === 'error' ? (
                                <>
                                    <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 mb-6">
                                        <AlertTriangle className="h-10 w-10 text-red-500" />
                                    </div>
                                    <h4 className="text-xl font-bold text-gray-900 mb-3">{t('profile.oops')}</h4>
                                    <p className="text-gray-600 mb-6">{alertMessage.message}</p>
                                </>
                            ) : null}

                            {/* Action Button */}
                            <button
                                onClick={() => setShowAlert(false)}
                                className={`w-full py-3.5 font-bold rounded-xl transition-all ${
                                    alertMessage.type === 'success'
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                                        : alertMessage.type === 'error'
                                            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                                }`}
                            >
                                {alertMessage.type === 'success' ? t('profile.continue') : t('profile.close')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add CSS for animations */}
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out;
                }
                .animate-slideUp {
                    animation: slideUp 0.3s ease-out;
                }
            `}</style>
        </div>
    );
};

export default UserProfile;