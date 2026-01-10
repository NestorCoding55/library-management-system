import { useTranslation } from 'react-i18next';
import { Globe, ChevronDown } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const LanguageSelector = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const languages = [
        { code: 'en', name: 'English', flag: '🇺🇸' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center text-white/90 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-all duration-200"
            >
                <Globe className="w-5 h-5 mr-2" />
                <span className="uppercase font-bold text-sm mr-1">
                    {i18n.language ? i18n.language.split('-')[0] : 'en'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu - CLICK BASED */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl overflow-hidden z-[100] border border-gray-100 animate-fadeIn origin-top-right">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => {
                                i18n.changeLanguage(lang.code);
                                setIsOpen(false); // Close after selection
                            }}
                            className={`w-full text-left px-4 py-3 text-sm flex items-center hover:bg-gray-50 transition-colors ${
                                i18n.language === lang.code ? 'text-blue-600 font-bold bg-blue-50' : 'text-gray-700'
                            }`}
                        >
                            <span className="mr-3 text-lg">{lang.flag}</span>
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSelector;