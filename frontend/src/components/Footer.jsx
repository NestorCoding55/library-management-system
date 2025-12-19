import Navbar from "./Navbar.jsx";

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Grid Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Column 1: Brand Info */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Library System</h3>
                        <p className="text-gray-400">
                            Empowering knowledge through efficient digital management.
                            Join our community today!
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Books</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Categories</a></li>
                            <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About</a></li>

                        </ul>

                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                        <div className="text-gray-400 space-y-2">
                            <p>123 Library Avenue</p>
                            <p>City of Knowledge, Reader Avenue 12345</p>
                            <p>Email: support@library.com </p>
                            <p>Phone: +1 234 567 8901</p>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar: Copyright */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
                   <p>&copy; {new Date().getFullYear()} Library System. All rights reserved  </p>
                </div>
            </div>

        </footer>
    )
}

export default Footer;