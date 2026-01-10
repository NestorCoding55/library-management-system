import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Phone, MapPin, MessageSquare, ChevronDown, ChevronUp, Send, HelpCircle } from "lucide-react";

const Support = () => {
    const { t } = useTranslation();

    // --- State for FAQ Accordion ---
    const [openIndex, setOpenIndex] = useState(null);

    // --- State for Contact Form ---
    const [formData, setFormData] = useState({ name: "", email: "", message: "" });
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSending(true);
        // Simulate sending
        setTimeout(() => {
            setSending(false);
            setSent(true);
            setFormData({ name: "", email: "", message: "" });
        }, 1500);
    };

    const faqs = [
        {
            question: t('support.faq_1_q'),
            answer: t('support.faq_1_a')
        },
        {
            question: t('support.faq_2_q'),
            answer: t('support.faq_2_a')
        },
        {
            question: t('support.faq_3_q'),
            answer: t('support.faq_3_a')
        },
        {
            question: t('support.faq_4_q'),
            answer: t('support.faq_4_a')
        },
        {
            question: t('support.faq_5_q'),
            answer: t('support.faq_5_a')
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            {/* Header / Hero */}
            <div className="text-center max-w-3xl mx-auto mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 text-blue-600 rounded-full mb-6">
                    <HelpCircle className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{t('support.title')}</h1>
                <p className="text-xl text-gray-500">
                    {t('support.subtitle')}
                </p>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">

                {/* LEFT COLUMN: FAQ & Info */}
                <div className="space-y-8">
                    {/* FAQ Section */}
                    <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                <MessageSquare className="w-6 h-6 mr-3 text-purple-600" />
                                {t('support.faq_title')}
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {faqs.map((faq, index) => (
                                <div key={index} className="group">
                                    <button
                                        onClick={() => toggleFAQ(index)}
                                        className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors focus:outline-none"
                                    >
                                        <span className={`font-semibold text-lg ${openIndex === index ? 'text-blue-600' : 'text-gray-700'}`}>
                                            {faq.question}
                                        </span>
                                        {openIndex === index ? (
                                            <ChevronUp className="w-5 h-5 text-blue-600" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                                        )}
                                    </button>
                                    {openIndex === index && (
                                        <div className="px-6 pb-6 text-gray-600 leading-relaxed animate-fadeIn">
                                            {faq.answer}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4">
                            <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{t('support.contact_email_title')}</h3>
                                <p className="text-sm text-gray-500 mt-1">support@library.com</p>
                                <p className="text-sm text-gray-500">24/7 Response time</p>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-start space-x-4">
                            <div className="bg-green-50 p-3 rounded-xl text-green-600">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">{t('support.contact_phone_title')}</h3>
                                <p className="text-sm text-gray-500 mt-1">+1 (555) 123-4567</p>
                                <p className="text-sm text-gray-500">Mon-Fri, 9am - 5pm</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Contact Form */}
                <div className="lg:pl-8">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 lg:p-10 sticky top-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('support.form_title')}</h2>
                        <p className="text-gray-500 mb-8">{t('support.form_subtitle')}</p>

                        {sent ? (
                            <div className="bg-green-50 border border-green-100 rounded-2xl p-8 text-center animate-fadeIn">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Send className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{t('support.msg_sent_title')}</h3>
                                <p className="text-gray-600 mb-6">{t('support.msg_sent_desc')}</p>
                                <button
                                    onClick={() => setSent(false)}
                                    className="text-blue-600 font-bold hover:underline"
                                >
                                    {t('support.btn_send_another')}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {t('support.label_name')}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder={t('support.placeholder_name', "Your Name")}
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {t('support.label_email')}
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white"
                                        placeholder={t('support.placeholder_email', "Your Email")}
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">
                                        {t('support.label_message')}
                                    </label>
                                    <textarea
                                        rows="5"
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-gray-50 focus:bg-white resize-none"
                                        placeholder={t('support.placeholder_message')}
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    ></textarea>
                                </div>
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                                >
                                    {sending ? (
                                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : (
                                        <>
                                            {t('support.btn_send')} <Send className="w-5 h-5 ml-2" />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Support;