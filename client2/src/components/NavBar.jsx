import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useSocket } from "../context/SocketContext";

const NavBar = () => {
  const { user, logout } = useApp() || {};
  const { notifications = [] } = useSocket() || {};
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            Donation App
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="hover:text-blue-200 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="hover:text-blue-200 transition-colors"
                >
                  {user.type == "donor" ? "Donate Item" : "Request Item"}
                </Link>
                <Link
                  to="/transactions"
                  className="hover:text-blue-200 transition-colors"
                >
                  Transactions
                </Link>

                {/* Notification icon */}
                <div className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="hover:text-blue-200 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                    {notifications.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {notifications.length}
                      </span>
                    )}
                  </button>

                  {/* Notification dropdown */}
                  {isNotificationOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg py-2 z-10 text-gray-800">
                      {notifications.length > 0 ? (
                        notifications.map((notification, index) => (
                          <div
                            key={index}
                            className="px-4 py-2 border-b border-gray-100 hover:bg-gray-50"
                          >
                            {notification.message}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">
                          No new notifications
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="hover:text-blue-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-500 hover:bg-blue-700 px-4 py-2 rounded transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={toggleMenu} className="md:hidden focus:outline-none">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-blue-500">
            <Link
              to="/"
              className="block py-2 hover:text-blue-200 transition-colors"
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className="block py-2 hover:text-blue-200 transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/upload"
                  className="block py-2 hover:text-blue-200 transition-colors"
                >
                  Donate Item
                </Link>
                <Link
                  to="/transactions"
                  className="block py-2 hover:text-blue-200 transition-colors"
                >
                  Transactions
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 hover:text-blue-200 transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signin"
                  className="block py-2 hover:text-blue-200 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="block py-2 hover:text-blue-200 transition-colors"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
