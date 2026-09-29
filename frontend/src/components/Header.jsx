import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm shadow-sm">
       <div className="max-w-7xl mx-auto px-6 md:px-10 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-[#1B3C53]">
          Uni<span className="text-blue-500">Nest</span>
        </Link>

        {/* Nav links - hidden on mobile */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <a href="#features" className="hover:text-[#1B3C53] transition-colors">
            Features
          </a>
          <a href="#about" className="hover:text-[#1B3C53] transition-colors">
            About
          </a>
        </nav>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-[#1B3C53] hover:bg-gray-100 rounded-lg transition-colors"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 text-sm font-semibold bg-[#1B3C53] text-white rounded-lg hover:bg-[#234C6A] transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}