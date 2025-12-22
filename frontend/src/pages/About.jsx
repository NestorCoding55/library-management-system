import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const About = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location]);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

            {/* Header Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">About Our Library</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    We are dedicated to providing universal access to knowledge and fueling the imagination of our community.
                </p>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Our Mission</h3>
                        <p className="text-gray-600 leading-relaxed">
                            To empower individuals through free and open access to information, ideas, and culture. We believe in the power of stories to connect people and transform lives.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Our History</h3>
                        <p className="text-gray-600 leading-relaxed">
                            Founded in 2024, our digital platform has grown from a small local initiative to a comprehensive resource serving thousands of readers daily.
                        </p>
                    </div>
                </div>

                {/* Visual/Image Section */}
                <div className="flex justify-center md:justify-end">
                    {/* The Box: Removed fixed height, added 'bg-white' and 'shadow-xl' for a clean look */}
                    <div className="group p-6 bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300">
                        <img
                            src={logo}
                            alt="Library Logo"
                            // The Image: Increased to h-60 (very big) and added nice hover effects
                            className="h-60 w-auto object-contain transform group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-500 ease-in-out"
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default About;