import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Home = () => {
    const { t } = useTranslation();
    const location = useLocation();

    // Scroll to top whenever the URL changes to this page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            {/* Hero Title */}
            <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                {t('home.hero_title')}
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-10 max-w-2xl">
                {t('home.hero_subtitle')}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-4">
                <Link
                    to="/books"
                    className="bg-blue-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
                >
                    {t('home.btn_browse')}
                </Link>
                <Link
                    to="/about"
                    className="bg-white text-gray-700 border-2 border-gray-200 px-8 py-3 rounded-full font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all"
                >
                    {t('home.btn_learn')}
                </Link>
            </div>

            {/* Stats Section */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 w-full max-w-4xl">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-4xl font-bold text-blue-600 mb-2">1k+</div>
                    <div className="text-gray-500">{t('home.stat_books')}</div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-4xl font-bold text-purple-600 mb-2">10+</div>
                    <div className="text-gray-500">{t('home.stat_categories')}</div>
                </div>
                <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="text-4xl font-bold text-indigo-600 mb-2">500+</div>
                    <div className="text-gray-500">{t('home.stat_readers')}</div>
                </div>
            </div>
        </div>
    );
};

export default Home;