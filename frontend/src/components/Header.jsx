import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        navigate('/login');
    };

    return (
        <header className="flex justify-between items-center text-white py-6 px-8 md:px-32 bg-black drop-shadow-lg">
  <div className="flex items-center space-x-8">
    <a
      href="/"
      className="text-4xl font-bold hover:scale-105 transition-all duration-300"
    >
      CarPOOL
    </a>
    {isLoggedIn && (
      <>
        <Link
          to="/search"
          className="font-semibold text-xl hover:underline transition-all duration-300"
        >
          Search
        </Link>
        <Link
          to="/share"
          className="font-semibold text-xl hover:underline transition-all duration-300"
        >
          Share
        </Link>
        <Link
          to="/trips"
          className="font-semibold text-xl hover:underline transition-all duration-300"
        >
          Trips
        </Link>
      </>
    )}
  </div>
  <div className="flex items-center space-x-4">
    {isLoggedIn ? (
      <button
        onClick={handleLogout}
        className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-all duration-300"
      >
        Logout
      </button>
    ) : (
      <>
        <Link
          to="/login"
          className="px-6 py-2 rounded-full font-semibold hover:bg-gray-800 hover:text-white transition-all duration-300"
        >
          Log in
        </Link>
        <Link
          to="/register"
          className="px-6 py-2 bg-white text-black rounded-full font-semibold hover:bg-gray-200 transition-all duration-300"
        >
          Sign up
        </Link>
      </>
    )}
  </div>
</header>
    );
};

export default Header;
