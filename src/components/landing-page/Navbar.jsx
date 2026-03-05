import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import assets from "../../assets/assets";
import { motion } from "framer-motion";
import { useTheme } from "../../context/ThemeContext";

const NAV_ITEMS = [
  ["Features", "#features"],
  ["Modules", "#modules"],
  ["How It Works", "#how-it-works"],
  ["Dashboard", "#dashboard"],
  ["Contact", "#contact-us"],
];

const Navbar = () => {
  const { theme, toggleTheme, isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [active, setActive] = useState("#features");

  useEffect(() => {
    // Initialize active state from URL hash
    if (typeof window !== "undefined") {
      setActive(window.location.hash || "#features");
    }

    const onScroll = () => {
      const currentScrollY = window.scrollY;

      // Show navbar when at top or scrolling up
      if (currentScrollY < lastScrollY || currentScrollY < 50) {
        setIsVisible(true);
      }
      // Hide navbar when scrolling down
      else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
      setScrolled(currentScrollY > 8);
    };

    const onHash = () => setActive(window.location.hash || "#features");

    window.addEventListener("scroll", onScroll);
    window.addEventListener("hashchange", onHash);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", onHash);
    };
  }, [lastScrollY]);

  const handleNavClick = (href) => {
    setActive(href);
    setOpen(false);
  };

  const [user, setUser] = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Check for user in local storage
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.charAt(0).toUpperCase();
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-x-0 top-0 z-30 backdrop-blur-lg transition-all duration-200 ${scrolled
        ? "bg-white/60 dark:bg-gray-900/85 shadow-md"
        : "bg-white/50 dark:bg-gray-900/70"
        }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* LEFT: Logo + subtitle */}
          <div className="flex items-start gap-3">
            <Link
              to="/"
              className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:opacity-80 transition-opacity cursor-pointer"
            >
              InfraVision
            </Link>
            <div className="hidden sm:block text-xs text-gray-600 dark:text-gray-300 mt-0.5">
              Smart City Monitoring
            </div>
          </div>

          {/* CENTER: Desktop nav - Fixed underline positioning */}
          <nav className="hidden sm:flex items-center gap-8 mx-auto">
            {NAV_ITEMS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => setActive(href)}
                className="relative px-2 py-1 text-sm text-gray-700 dark:text-gray-200 hover:text-[#5044E5] dark:hover:text-white transition-colors duration-200"
                aria-current={active === href ? "page" : undefined}
              >
                <span className="select-none block pb-2">{label}</span>
                <span
                  className={`absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-gradient-to-r from-[#5044E5] to-[#4d8cea] transition-all duration-300 ${active === href
                    ? "w-full opacity-100"
                    : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    }`}
                />
              </a>
            ))}
          </nav>

          {/* RIGHT: controls */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-yellow-500">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-700">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.75 9.75 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
                </svg>
              )}
            </button>

            {user ? (
              <Link
                to="/profile"
                className="w-10 h-10 rounded-full bg-[#5044E5] text-white flex items-center justify-center font-bold hover:opacity-90 transition-opacity"
              >
                {getInitials(user.name)}
              </Link>
            ) : (
              /* Login (ghost) - hidden on small screens */
              <Link
                to="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm border border-[#5044E5] text-[#5044E5] dark:text-white/90 hover:bg-[#5044E5] hover:text-white transition-all duration-200"
              >
                Login
              </Link>
            )}

            {/* Primary CTA */}
            <Link
              to="/report"
              className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white px-5 py-2.5 rounded-full cursor-pointer shadow-md hover:scale-105 transition-all duration-200"
            >
              Report an Issue
            </Link>

            {/* Mobile: hamburger */}
            <button
              onClick={() => setOpen((s) => !s)}
              aria-label="Open menu"
              aria-expanded={open}
              className="sm:hidden ml-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <img
                src={open ? assets.close_icon : assets.menu_icon_dark}
                alt="menu"
                className="w-6 h-6"
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <div
        className={`sm:hidden absolute inset-x-0 top-full mt-2 z-40 transform-gpu transition-all duration-300 ${open
          ? "translate-y-0 opacity-100 visible"
          : "-translate-y-4 opacity-0 invisible"
          }`}
      >
        <div className="mx-4 bg-white/95 dark:bg-gray-900/95 rounded-xl p-4 shadow-lg backdrop-blur-md">
          <nav className="flex flex-col gap-2">
            {NAV_ITEMS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={() => handleNavClick(href)}
                className={`px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${active === href
                  ? "text-white bg-gradient-to-r from-[#5044E5] to-[#4d8cea]"
                  : "text-gray-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                {label}
              </a>
            ))}

            <div className="mt-4 border-t border-gray-200 dark:border-white/10 pt-4 flex flex-col gap-3">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-full border border-[#5044E5] text-center text-sm text-[#5044E5] dark:text-white/90 hover:bg-[#5044E5] hover:text-white transition duration-200"
              >
                Login
              </Link>
              <Link
                to="/report"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-full text-center bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white hover:scale-[1.02] transition-all duration-200"
              >
                Report an Issue
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
