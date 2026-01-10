import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import logo from '../assets/logo.png';
import { BookOpen, Clock, DollarSign, Shield, TrendingUp, Users } from 'lucide-react';

const About = () => {
    const { t } = useTranslation();
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const features = [
        {
            icon: <Clock className="w-6 h-6" />,
            title: t('about.feat_time_title'),
            description: t('about.feat_time_desc'),
            color: "text-blue-600 bg-blue-50"
        },
        {
            icon: <DollarSign className="w-6 h-6" />,
            title: t('about.feat_price_title'),
            description: t('about.feat_price_desc'),
            color: "text-green-600 bg-green-50"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: t('about.feat_focus_title'),
            description: t('about.feat_focus_desc'),
            color: "text-purple-600 bg-purple-50"
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: t('about.feat_community_title'),
            description: t('about.feat_community_desc'),
            color: "text-orange-600 bg-orange-50"
        }
    ];

    const stats = [
        { value: "3x", label: t('about.stat_more_books', "More books read") },
        { value: "72h", label: t('about.stat_per_loan', "Per book loan") },
        { value: "1", label: t('about.stat_book_at_time', "Book at a time") },
        { value: "$5", label: t('about.stat_flat_rate', "Flat rate") }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-20">
                    <div className="inline-flex items-center justify-center mb-6">
                        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                            <BookOpen className="w-12 h-12 text-white" />
                        </div>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
                        {t('about.hero_title')}
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        {t('about.hero_subtitle')}
                    </p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 max-w-4xl mx-auto">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center transform hover:-translate-y-1 transition-all duration-300"
                        >
                            <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                            <div className="text-gray-600 font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                    {/* Left Column - Text Content */}
                    <div className="space-y-10">
                        <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-3xl shadow-lg border border-blue-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Users className="w-6 h-6 text-blue-600" />
                                </div>
                                <h2 className="text-3xl font-bold text-gray-900">{t('about.mission_title', "Our Mission")}</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                {t('about.mission_description', "We exist for one purpose: to help people read more books in less time. In today's fast-paced world, most books gather dust on shelves. We're changing that.")}
                            </p>
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                <p className="text-gray-800 font-medium">
                                    📚 {t('about.proven_system', "Our proven system: $5 for 3 days with only one book at a time.")}
                                </p>
                            </div>
                        </div>

                        {/* How It Works */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-gray-900">{t('about.science_title', "The Science Behind Our System")}</h3>
                            <div className="space-y-6">
                                {features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start gap-4 p-4 rounded-xl hover:bg-white hover:shadow-md transition-all duration-300"
                                    >
                                        <div className={`p-3 rounded-lg ${feature.color}`}>
                                            {feature.icon}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900 mb-1">{feature.title}</h4>
                                            <p className="text-gray-600">{feature.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Visual */}
                    <div className="relative">
                        <div className="sticky top-24">
                            {/* Floating Card Container */}
                            <div className="relative">
                                {/* Background Decorative Elements */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl"></div>

                                {/* Main Card */}
                                <div className="relative bg-gradient-to-br from-white to-blue-50 rounded-3xl shadow-2xl border border-gray-200 overflow-hidden group">
                                    {/* Card Header */}
                                    <div className="p-8 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
                                        <h3 className="text-2xl font-bold mb-2">{t('about.perfect_rhythm', "The Perfect Reading Rhythm")}</h3>
                                        <p className="text-blue-100">{t('about.hours_focused', "72 hours of focused reading")}</p>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-8">
                                        <div className="flex flex-col items-center justify-center mb-8">
                                            <div className="relative mb-8 transform group-hover:scale-105 transition-transform duration-500">
                                                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-lg opacity-30"></div>
                                                <img
                                                    src={logo}
                                                    alt="Library Logo"
                                                    className="relative w-64 h-64 object-contain drop-shadow-lg"
                                                />
                                            </div>

                                            {/* Progress Circle */}
                                            <div className="relative w-48 h-48 mb-8">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="text-center">
                                                        <div className="text-4xl font-bold text-gray-900">72h</div>
                                                        <div className="text-gray-600">{t('about.reading_window', "Reading Window")}</div>
                                                    </div>
                                                </div>
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle
                                                        cx="96"
                                                        cy="96"
                                                        r="84"
                                                        stroke="currentColor"
                                                        strokeWidth="12"
                                                        fill="none"
                                                        className="text-gray-200"
                                                    />
                                                    <circle
                                                        cx="96"
                                                        cy="96"
                                                        r="84"
                                                        stroke="currentColor"
                                                        strokeWidth="12"
                                                        fill="none"
                                                        strokeDasharray="528"
                                                        strokeDashoffset="132"
                                                        strokeLinecap="round"
                                                        className="text-blue-500 animate-pulse"
                                                    />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Key Benefits */}
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                                <div className="p-2 bg-green-100 rounded-lg">
                                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{t('about.reading_speed', "3x Reading Speed")}</div>
                                                    <div className="text-sm text-gray-600">{t('about.members_finish', "Members finish books faster")}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Shield className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">{t('about.zero_distractions', "Zero Distractions")}</div>
                                                    <div className="text-sm text-gray-600">{t('about.one_book_policy', "One book policy ensures focus")}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-center text-white shadow-2xl">
                    <h2 className="text-3xl font-bold mb-4">{t('about.ready_title', "Ready to Read More?")}</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        {t('about.join_thousands', "Join thousands who have discovered the joy of reading more books in less time.")}
                    </p>
                    <div className="inline-flex flex-col sm:flex-row gap-6 items-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                            <div className="text-4xl font-bold">{t('about.price_big')}</div>
                            <div className="text-blue-100">{t('about.price_per_loan')}</div>
                        </div>
                        <div className="text-left">
                            <div className="text-lg font-semibold">{t('about.what_you_get')}</div>
                            <ul className="text-blue-100 space-y-2 mt-2">
                                <li className="flex items-center gap-2">✓ {t('about.point_1')}</li>
                                <li className="flex items-center gap-2">✓ {t('about.point_2')}</li>
                                <li className="flex items-center gap-2">✓ {t('about.point_3')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;