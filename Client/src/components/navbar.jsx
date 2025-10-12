import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const userId = localStorage.getItem("userId");
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();

  const handleAuthClick = (action) => {
    if (accessToken) {
      toast.info(`You are already logged in. Cannot ${action}.`);
    } else {
      if (action === "login") navigate("/login");
      else if (action === "signup") navigate("/signup");
    }
  };

  return (
    <header className="bg-white text-gray-800 shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            <span className="bg-blue-600 text-white px-2 py-1 rounded-md">ev</span>Mate
          </Link>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {!accessToken && (
            <>
              <button
                onClick={() => handleAuthClick("login")}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm hover:bg-blue-700 transition"
              >
                Login
              </button>
              <button
                onClick={() => handleAuthClick("signup")}
                className="bg-gray-200 text-gray-800 px-4 py-1.5 rounded-full text-sm hover:bg-gray-300 transition"
              >
                Signup
              </button>
            </>
          )}

          <Link
            to="/hostevent"
            className="flex items-center gap-1 border border-gray-300 rounded-full px-4 py-1.5 hover:bg-gray-100 transition text-sm"
          >
            <span className="text-lg font-medium">+</span> Host
          </Link>

          <Link to={`/profile/${userId}`}>
            <FaUserCircle size={28} className="text-gray-700 hover:text-blue-600" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          aria-label="Toggle menu"
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <ul className="md:hidden flex flex-col gap-3 mt-2 px-6 pb-4 bg-gray-50 border-t">
          {!accessToken && (
            <>
              <li>
                <button
                  onClick={() => handleAuthClick("login")}
                  className="w-full bg-blue-600 text-white py-2 rounded-full text-sm hover:bg-blue-700 transition"
                >
                  Login
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleAuthClick("signup")}
                  className="w-full bg-gray-200 text-gray-800 py-2 rounded-full text-sm hover:bg-gray-300 transition"
                >
                  Signup
                </button>
              </li>
            </>
          )}

          <li>
            <Link
              to="/hostevent"
              className="block py-2 text-center border border-gray-300 rounded-full hover:bg-gray-100 text-sm"
            >
              + Host
            </Link>
          </li>
          <li>
            <Link to={`/profile/${userId}`} className="flex justify-center">
              <FaUserCircle size={28} className="text-gray-700 hover:text-blue-600" />
            </Link>
          </li>
        </ul>
      )}
    </header>
  );
};

export default Navbar;
