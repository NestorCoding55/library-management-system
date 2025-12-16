const BookList = () => {
    // 1. Temporary Mock Data (We will replace this with real Database data later)
    const books = [
        { id: 1, title: "Clean Code", author: "Robert C. Martin", category: "Tech", available: true },
        { id: 2, title: "The Great Gatsby", author: "F. Scott Fitzgerald", category: "Classic", available: true },
        { id: 3, title: "Spring Boot in Action", author: "Craig Walls", category: "Tech", available: true },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

            {/* Header Section */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Library Collection
                </h2>
                <p className="text-gray-500 mt-2">Explore our vast collection of knowledge.</p>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {/* Mapping through books */}
                {books.map((book) => (
                    <div
                        key={book.id}
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
                    >
                        {/* Card Decorator (Top Gradient Line) */}
                        <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

                        <div className="p-6">
                            {/* Category Badge */}
                            <span className="text-xs font-semibold tracking-wide uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                {book.category}
              </span>

                            {/* Title & Author */}
                            <h3 className="mt-4 text-xl font-bold text-gray-800">{book.title}</h3>
                            <p className="text-gray-500 text-sm mt-1">by {book.author}</p>

                            {/* Status Indicator */}
                            <div className="mt-6 flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    book.available
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                }`}>
                  {book.available ? 'Available' : 'Borrowed'}
                </span>

                                <button className="text-blue-600 hover:text-purple-600 font-semibold text-sm transition-colors">
                                    View Details →
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BookList;