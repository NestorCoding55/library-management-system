import { Routes, Route } from 'react-router-dom'; // Import these
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Books from "./pages/Books";
import About from "./pages/About";
import Categories from "./pages/Categories";
import BookDetails from "./pages/BookDetails";

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-purple-100 to-blue-100 animate-gradient">
            <Navbar />

            <main className="flex-grow">
                <Routes>
                    {/* When URL is "/", show Home */}
                    <Route path="/" element={<Home />} />

                    {/* When URL is "/books", show Books */}
                    <Route path="/books" element={<Books />} />
                    <Route path="/books/:id" element={<BookDetails />} />

                    <Route path="/categories" element={<Categories />} />

                    {/* When URL is "/about", show About */}
                    <Route path="/about" element={<About />} />


                </Routes>
            </main>

            <Footer />
        </div>
    );
}

export default App;