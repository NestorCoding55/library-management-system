import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ManageBooks = () => {
    // --- State Management ---
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false); // Toggles between List and Form view
    const [isEditing, setIsEditing] = useState(false);   // Toggles between Add and Update mode

    // Form State (Reused for Add & Edit)
    const [currentBook, setCurrentBook] = useState({
        id: null,
        title: "",
        author: "",
        category: "Science Fiction",
        isbn: "",
        description: "",
        available: true
    });

    // --- 1. Fetch Books on Load ---
    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await axios.get("http://localhost:8080/api/books");
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
            alert("Could not load books.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    // --- 2. Handle Form Input ---
    const handleChange = (e) => {
        setCurrentBook({ ...currentBook, [e.target.name]: e.target.value });
    };

    // --- 3. Handle Create / Update ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        try {
            if (isEditing) {
                // UPDATE logic (PUT)
                await axios.put(`http://localhost:8080/api/books/${currentBook.id}`, currentBook, { headers });
                alert("Book updated successfully!");
            } else {
                // CREATE logic (POST)
                await axios.post("http://localhost:8080/api/books", currentBook, { headers });
                alert("Book created successfully!");
            }

            // Reset and Reload
            setIsFormOpen(false);
            fetchBooks();

        } catch (error) {
            console.error("Error saving book:", error);
            alert("Operation failed.");
        }
    };

    // --- 4. Handle Delete ---
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this book? This cannot be undone.")) return;

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        try {
            await axios.delete(`http://localhost:8080/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            // Remove from local state immediately to avoid reload
            setBooks(books.filter(book => book.id !== id));
            alert("Book deleted.");
        } catch (error) {
            console.error("Error deleting book:", error);
            alert("Failed to delete book.");
        }
    };

    // --- Helper: Open Form for ADD ---
    const openAddForm = () => {
        setCurrentBook({
            id: null, title: "", author: "", category: "Science Fiction",
            isbn: "", description: "", available: true
        });
        setIsEditing(false);
        setIsFormOpen(true);
    };

    // --- Helper: Open Form for EDIT ---
    const openEditForm = (book) => {
        setCurrentBook(book); // Pre-fill form with book data
        setIsEditing(true);
        setIsFormOpen(true);
    };

    // --- RENDER ---
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Manage Library Books</h1>
                    {!isFormOpen && (
                        <div className="space-x-4">
                            <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                                Back to Dashboard
                            </Link>
                            <button
                                onClick={openAddForm}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5"
                            >
                                + Add New Book
                            </button>
                        </div>
                    )}
                </div>

                {/* CONDITIONAL RENDER: Form OR List */}
                {isFormOpen ? (
                    // --- FORM VIEW ---
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-3xl mx-auto">
                        <div className={`px-8 py-6 ${isEditing ? 'bg-indigo-600' : 'bg-blue-600'}`}>
                            <h2 className="text-2xl font-bold text-white">
                                {isEditing ? "Edit Book Details" : "Add New Book"}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                    <input name="title" value={currentBook.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                                    <input name="author" value={currentBook.author} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                                    <input name="isbn" value={currentBook.isbn} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                                    <select name="category" value={currentBook.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                        {["Science Fiction", "History", "Technology", "Romance", "Mystery", "Fantasy"].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea name="description" value={currentBook.description} onChange={handleChange} rows="4" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className={`px-6 py-2 text-white rounded-lg font-semibold shadow-md ${isEditing ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {isEditing ? "Update Book" : "Save Book"}
                                </button>
                            </div>
                        </form>
                    </div>

                ) : (
                    // --- LIST VIEW (Table) ---
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        {loading ? (
                            <div className="p-10 text-center text-gray-500">Loading books...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Title / Author</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ISBN</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {books.map((book) => (
                                        <tr key={book.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-gray-900">{book.title}</div>
                                                <div className="text-sm text-gray-500">{book.author}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                                                        {book.category}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                                                {book.isbn}
                                            </td>
                                            <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${book.available ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                                                        {book.available ? 'Available' : 'Borrowed'}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditForm(book)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium text-sm transition-colors"
                                                >
                                                    Edit
                                                </button>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    onClick={() => handleDelete(book.id)}
                                                    className="text-red-600 hover:text-red-900 font-medium text-sm transition-colors"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {books.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                No books found. Click "Add New Book" to start.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageBooks;