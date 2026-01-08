import React, { useState, useEffect } from "react";
import assets from "../assets/assets";
import { motion } from "framer-motion";

const NAV_ITEMS = [
  ["Features", "#features"],
  ["Modules", "#modules"],
  ["How It Works", "#how-it-works"],
  ["Dashboard", "#dashboard"],
  ["Contact", "#contact-us"],
];

const Navbar = () => {
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

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed inset-x-0 top-0 z-30 backdrop-blur-lg transition-all duration-200 ${
        scrolled
          ? "bg-white/60 dark:bg-gray-900/85 shadow-md"
          : "bg-white/50 dark:bg-gray-900/70"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* LEFT: Logo + subtitle */}
          <div className="flex items-start gap-3">
            <div className="text-lg sm:text-xl font-bold tracking-tight text-white dark:text-white">
              InfraVision
            </div>
            <div className="hidden sm:block text-xs text-gray-200 dark:text-gray-300 mt-0.5">
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
                  className={`absolute left-0 right-0 bottom-0 h-[3px] rounded-full bg-gradient-to-r from-[#5044E5] to-[#4d8cea] transition-all duration-300 ${
                    active === href
                      ? "w-full opacity-100"
                      : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                  }`}
                />
              </a>
            ))}
          </nav>

          {/* RIGHT: controls */}
          <div className="flex items-center gap-4">
            {/* Login (ghost) - hidden on small screens */}
            <a
              href="#login"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-full text-sm border border-[#5044E5] text-[#5044E5] dark:text-white/90 hover:bg-[#5044E5] hover:text-white transition-all duration-200"
            >
              Login
            </a>

            {/* Primary CTA */}
            <button className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white px-5 py-2.5 rounded-full cursor-pointer shadow-md hover:scale-105 transition-all duration-200">
              Report an Issue
            </button>

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
        className={`sm:hidden absolute inset-x-0 top-full mt-2 z-40 transform-gpu transition-all duration-300 ${
          open
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
                className={`px-4 py-3 rounded-lg text-base font-medium transition-colors duration-200 ${
                  active === href
                    ? "text-white bg-gradient-to-r from-[#5044E5] to-[#4d8cea]"
                    : "text-gray-700 dark:text-white/90 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {label}
              </a>
            ))}

            <div className="mt-4 border-t border-gray-200 dark:border-white/10 pt-4 flex flex-col gap-3">
              <a
                href="#login"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-full border border-[#5044E5] text-center text-sm text-[#5044E5] dark:text-white/90 hover:bg-[#5044E5] hover:text-white transition duration-200"
              >
                Login
              </a>
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-full text-center bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white hover:scale-[1.02] transition-all duration-200"
              >
                Report an Issue
              </button>
            </div>
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
