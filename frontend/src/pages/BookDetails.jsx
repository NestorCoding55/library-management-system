import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const BookDetails = () => {
    const { id } = useParams(); // Get ID from URL
    const navigate = useNavigate();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch single book by ID
        fetch(`http://localhost:8080/api/books/${id}`)
            .then(res => res.json())
            .then(data => {
                setBook(data);
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, [id]);

    if (loading) return <div className="text-center py-20">Loading details...</div>;
    if (!book) return <div className="text-center py-20">Book not found!</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            {/* Back Button */}
            <button
                onClick={() => navigate('/books')}
                className="mb-6 text-blue-600 hover:text-blue-800 flex items-center font-semibold"
            >
                ← Back to Collection
            </button>

            <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">

                {/* Left: Visual Cover (Gradient placeholder since we don't have real images yet) */}
                <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-purple-600 p-8 flex items-center justify-center text-white">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-2">{book.title[0]}</h1>
                        <p className="opacity-75">No Cover Image</p>
                    </div>
                </div>

                {/* Right: Info */}
                <div className="p-8 md:w-2/3">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{book.title}</h1>
                            <p className="text-xl text-gray-600 mb-4">by {book.author}</p>
                        </div>
                        <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full uppercase">
                            {book.category}
                        </span>
                    </div>

                    <div className="h-1 w-20 bg-blue-500 rounded my-6"></div>

                    <h3 className="font-bold text-gray-900 mb-2">Synopsis</h3>
                    <p className="text-gray-600 leading-relaxed mb-8">
                        {book.description || "No description available for this book yet."}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 border-t pt-6">
                        <div>
                            <span className="block font-bold text-gray-700">ISBN</span>
                            {book.isbn}
                        </div>
                        <div>
                            <span className="block font-bold text-gray-700">Status</span>
                            <span className={book.available ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                                {book.available ? "Available to Borrow" : "Currently Borrowed"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BookDetails;