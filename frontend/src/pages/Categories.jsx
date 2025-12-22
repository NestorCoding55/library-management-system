import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Categories = () => {
    const location = useLocation();
    useEffect(() => { window.scrollTo(0, 0); }, [location]);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCategories = async () => {
        console.log("--- STARTING FETCH ---"); // Debug Log
        try {
            setLoading(true);
            const url = "http://localhost:8080/api/books/categories";

            console.log("Fetching from:", url); // Debug Log
            const response = await fetch(url);

            console.log("Response Status:", response.status); // Debug Log

            if (!response.ok) {
                throw new Error(`Server Error: ${response.status}`);
            }

            const data = await response.json();
            console.log("Data Received:", data); // Debug Log

            // Check if data is actually an array
            if (Array.isArray(data)) {
                setCategories(data);
                setError(null);
            } else {
                console.error("Data is not an array!", data);
                throw new Error("Data format invalid");
            }

        } catch (err) {
            console.error("FETCH FAILED:", err); // Debug Log
            setError(err.message);
            // We removed the dummy data fallback so we can see the real error!
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const getGradient = (index) => {
        const gradients = [
            "from-blue-500 to-cyan-400", "from-purple-500 to-pink-400",
            "from-orange-500 to-amber-400", "from-emerald-500 to-teal-400",
            "from-red-500 to-rose-400", "from-indigo-500 to-violet-400"
        ];
        return gradients[index % gradients.length];
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse by Category</h1>
            </div>

            {loading && (
                <div className="text-center py-20">Loading...</div>
            )}

            {/* This will show us exactly why it failed on screen */}
            {error && (
                <div className="text-center bg-red-100 text-red-700 p-6 rounded-lg border border-red-300">
                    <h3 className="font-bold text-xl">Error Loading Categories</h3>
                    <p>{error}</p>
                    <p className="text-sm mt-2">Check the Console (F12) for more details.</p>
                </div>
            )}

            {!loading && !error && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        // NEW: We attach the category name to the URL
                        <Link
                            key={category.id}
                            to={`/books?category=${encodeURIComponent(category.name)}`}
                            className="group block h-full"
                        >
                            <div className="relative bg-white rounded-2xl p-8 shadow-md border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 h-full overflow-hidden">
                                <div className={`absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 rounded-full bg-gradient-to-br ${getGradient(index)} opacity-20 group-hover:scale-150 transition-transform duration-500`}></div>
                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getGradient(index)} flex items-center justify-center text-white font-bold text-xl mb-6 shadow-lg`}>
                                    {category.name.charAt(0)}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-gray-500">{category.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Categories;