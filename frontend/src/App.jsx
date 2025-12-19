import Navbar from "./components/Navbar.jsx";
import BookList from "./components/BookList.jsx";
import Footer from "./components/Footer.jsx";

function App() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-slate-50 to-purple-100/40">
            <Navbar />
            <main className="flex-grow">
                <BookList />
            </main>
            <Footer />
        </div>
    )
}

export default App;