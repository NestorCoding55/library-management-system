import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const ManageBooks = () => {
    const { t } = useTranslation();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [currentBook, setCurrentBook] = useState({
        id: null,
        title: "",
        author: "",
        category: "Science Fiction",
        isbn: "",
        description: "",
        available: true
    });

    const fetchBooks = async () => {
        try {
            setLoading(true);
            const response = await axios.get("https://library-backend-y49e.onrender.com/api/books");
            setBooks(response.data);
        } catch (error) {
            console.error("Error fetching books:", error);
            alert(t('admin.books_fetch_error', 'Could not load books.'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleChange = (e) => {
        setCurrentBook({ ...currentBook, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };

        try {
            if (isEditing) {
                await axios.put(`https://library-backend-y49e.onrender.com/api/books/${currentBook.id}`, currentBook, { headers });
                alert(t('admin.book_updated', 'Book updated successfully!'));
            } else {
                await axios.post("https://library-backend-y49e.onrender.com", currentBook, { headers });
                alert(t('admin.book_created', 'Book created successfully!'));
            }

            setIsFormOpen(false);
            fetchBooks();

        } catch (error) {
            console.error("Error saving book:", error);
            alert(t('admin.operation_failed', 'Operation failed.'));
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm(t('admin.confirm_delete_book', 'Are you sure you want to delete this book? This cannot be undone.'))) return;

        const token = localStorage.getItem("token") || sessionStorage.getItem("token");
        try {
            await axios.delete(`https://library-backend-y49e.onrender.com/api/books/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBooks(books.filter(book => book.id !== id));
            alert(t('admin.book_deleted', 'Book deleted.'));
        } catch (error) {
            console.error("Error deleting book:", error);
            alert(t('admin.delete_failed', 'Failed to delete book.'));
        }
    };

    const openAddForm = () => {
        setCurrentBook({
            id: null, title: "", author: "", category: "Science Fiction",
            isbn: "", description: "", available: true
        });
        setIsEditing(false);
        setIsFormOpen(true);
    };

    const openEditForm = (book) => {
        setCurrentBook(book);
        setIsEditing(true);
        setIsFormOpen(true);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t('admin.books_title', 'Manage Library Books')}</h1>
                    {!isFormOpen && (
                        <div className="space-x-4">
                            <Link to="/admin/dashboard" className="text-gray-600 hover:text-blue-600 font-medium">
                                {t('admin.back_to_dashboard', 'Back to Dashboard')}
                            </Link>
                            <button
                                onClick={openAddForm}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-lg transition-all transform hover:-translate-y-0.5"
                            >
                                {t('admin.btn_add_book', '+ Add New Book')}
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
                                {isEditing ? t('admin.form_edit_title', 'Edit Book Details') : t('admin.form_add_title', 'Add New Book')}
                            </h2>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.label_title', 'Book Title')}</label>
                                    <input name="title" value={currentBook.title} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.label_author', 'Author')}</label>
                                    <input name="author" value={currentBook.author} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.label_isbn', 'ISBN')}</label>
                                    <input name="isbn" value={currentBook.isbn} onChange={handleChange} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.label_category', 'Category')}</label>
                                    <select name="category" value={currentBook.category} onChange={handleChange} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
                                        {["Science Fiction", "History", "Technology", "Romance", "Mystery", "Fantasy"].map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('admin.label_desc', 'Description')}</label>
                                <textarea name="description" value={currentBook.description} onChange={handleChange} rows="4" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
                            </div>

                            <div className="flex justify-end space-x-4 pt-4 border-t">
                                <button type="button" onClick={() => setIsFormOpen(false)} className="px-6 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">{t('admin.btn_cancel', 'Cancel')}</button>
                                <button type="submit" className={`px-6 py-2 text-white rounded-lg font-semibold shadow-md ${isEditing ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-600 hover:bg-blue-700'}`}>
                                    {isEditing ? t('admin.btn_save', 'Update Book') : t('admin.btn_create', 'Save Book')}
                                </button>
                            </div>
                        </form>
                    </div>

                ) : (
                    // --- LIST VIEW (Table) ---
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                        {loading ? (
                            <div className="p-10 text-center text-gray-500">{t('admin.loading_books', 'Loading books...')}</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.table_title', 'Title / Author')}</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.table_category', 'Category')}</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.table_isbn', 'ISBN')}</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('admin.table_status', 'Status')}</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">{t('admin.table_actions', 'Actions')}</th>
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
                                                        {book.available ? t('admin.status_available', 'Available') : t('admin.status_rented', 'Borrowed')}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                <button
                                                    onClick={() => openEditForm(book)}
                                                    className="text-indigo-600 hover:text-indigo-900 font-medium text-sm transition-colors"
                                                >
                                                    {t('admin.btn_edit', 'Edit')}
                                                </button>
                                                <span className="text-gray-300">|</span>
                                                <button
                                                    onClick={() => handleDelete(book.id)}
                                                    className="text-red-600 hover:text-red-900 font-medium text-sm transition-colors"
                                                >
                                                    {t('admin.btn_delete', 'Delete')}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {books.length === 0 && (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                                                {t('admin.empty_books', 'No books found. Click "Add New Book" to start.')}
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