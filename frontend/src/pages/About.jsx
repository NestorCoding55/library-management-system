import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';
import { BookOpen, Clock, DollarSign, Shield, TrendingUp, Users } from 'lucide-react';

const About = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    const features = [
        {
            icon: <Clock className="w-6 h-6" />,
            title: "3-Day Reading Window",
            description: "Each book is a 3-day adventure. Our system encourages focused, immersive reading without distractions.",
            color: "text-blue-600 bg-blue-50"
        },
        {
            icon: <DollarSign className="w-6 h-6" />,
            title: "$5 Flat Rate",
            description: "Affordable access for everyone. Just $5 gives you 72 hours of unlimited reading.",
            color: "text-green-600 bg-green-50"
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "One Book at a Time",
            description: "Deep focus beats multitasking. Complete your current book to unlock the next.",
            color: "text-purple-600 bg-purple-50"
        },
        {
            icon: <TrendingUp className="w-6 h-6" />,
            title: "Read More, Faster",
            description: "Our members read 3x more books than average. The time constraint creates momentum.",
            color: "text-orange-600 bg-orange-50"
        }
    ];

    const stats = [
        { value: "3x", label: "More books read" },
        { value: "72h", label: "Per book loan" },
        { value: "1", label: "Book at a time" },
        { value: "$5", label: "Flat rate" }
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
                        Revolutionizing
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                            How We Read
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        We're on a mission to transform casual readers into voracious book lovers through our unique, focused reading system.
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
                                <h2 className="text-3xl font-bold text-gray-900">Our Mission</h2>
                            </div>
                            <p className="text-gray-700 leading-relaxed text-lg mb-6">
                                We exist for one purpose: <span className="font-bold text-blue-700">to help people read more books in less time.</span> In today's fast-paced world, most books gather dust on shelves. We're changing that.
                            </p>
                            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                                <p className="text-gray-800 font-medium">
                                    📚 Our proven system: <span className="font-bold">$5 for 3 days</span> with <span className="font-bold">only one book at a time</span>.
                                </p>
                            </div>
                        </div>

                        {/* How It Works */}
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-gray-900">The Science Behind Our System</h3>
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
                                        <h3 className="text-2xl font-bold mb-2">The Perfect Reading Rhythm</h3>
                                        <p className="text-blue-100">72 hours of focused reading</p>
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
                                                        <div className="text-gray-600">Reading Window</div>
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
                                                    <div className="font-bold text-gray-900">3x Reading Speed</div>
                                                    <div className="text-sm text-gray-600">Members finish books faster</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                                                <div className="p-2 bg-purple-100 rounded-lg">
                                                    <Shield className="w-5 h-5 text-purple-600" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900">Zero Distractions</div>
                                                    <div className="text-sm text-gray-600">One book policy ensures focus</div>
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
                    <h2 className="text-3xl font-bold mb-4">Ready to Read More?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands who have discovered the joy of reading more books in less time.
                    </p>
                    <div className="inline-flex flex-col sm:flex-row gap-6 items-center">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6">
                            <div className="text-4xl font-bold">$5</div>
                            <div className="text-blue-100">per book loan</div>
                        </div>
                        <div className="text-left">
                            <div className="text-lg font-semibold">What you get:</div>
                            <ul className="text-blue-100 space-y-2 mt-2">
                                <li className="flex items-center gap-2">✓ 3 full days with your book</li>
                                <li className="flex items-center gap-2">✓ Focus on one book at a time</li>
                                <li className="flex items-center gap-2">✓ No distractions, just reading</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;