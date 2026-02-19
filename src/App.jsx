import { useEffect, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import TrustedBy from "./components/TrustedBy";
import Services from "./components/Services";
import OurWork from "./components/OurWork";
import Teams from "./components/Teams";
import ContactUs from "./components/ContactUs";
import Footer from "./components/Footer";
import LoaderWrapper from "./components/LoaderWrapper";
import { Toaster } from "react-hot-toast";
import Report from "./pages/Report";
import Dashboard from "./pages/Dashboard";
import LoginForm from "./features/auth/forms/LoginForm";
import SignupForm from "./features/auth/forms/SignupForm";
import ForgotPasswordForm from "./features/auth/forms/ForgotPasswordForm";
import ResetPasswordForm from "./features/auth/forms/ResetPasswordForm";
import EmailVerified from "./features/auth/EmailVerified";
import GoogleSuccess from "./features/auth/GoogleSuccess";
import AuthSuccess from "./features/auth/AuthSuccess";
import AccountExists from "./features/auth/AccountExists";
import NoAccountFound from "./features/auth/NoAccountFound";
import Profile from "./pages/Profile";
import StreetlightDashboard from "./components/StreetlightDashboard";
import AdminDashboard from "./admin_dashboard/App";
import WaterLeakage from "./pages/WaterLeakage";

// Home page
const Home = () => {
  return (
    <LoaderWrapper>
      <div className="relative bg-white dark:bg-black text-black dark:text-white transition-colors duration-300 pt-16 sm:pt-20">
        <Navbar />
        <Hero />
        <TrustedBy />
        <Services />
        <OurWork />
        <Teams />
        <ContactUs />
        <Footer />
      </div>
    </LoaderWrapper>
  );
};

const App = () => {
  // Force dark mode removed for theme toggle
  // useEffect(() => {
  //   document.documentElement.classList.add("dark");
  // }, []);

  const dotRef = useRef(null);
  const outlineRef = useRef(null);

  const mouse = useRef({ x: 0, y: 0 });
  const position = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    document.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      position.current.x += (mouse.current.x - position.current.x) * 0.1;
      position.current.y += (mouse.current.y - position.current.y) * 0.1;

      if (dotRef.current && outlineRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x - 6
          }px, ${mouse.current.y - 6}px, 0)`;

        outlineRef.current.style.transform = `translate3d(${position.current.x - 20
          }px, ${position.current.y - 20}px, 0)`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      <Toaster />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/report" element={<Report />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/reset-password" element={<ResetPasswordForm />} />
        <Route path="/email-verified" element={<EmailVerified />} />
        <Route path="/google-success" element={<GoogleSuccess />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
        <Route path="/account-exists" element={<AccountExists />} />
        <Route path="/no-account-found" element={<NoAccountFound />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/streetlights" element={<StreetlightDashboard />} />
        <Route path="/main-dashboard/*" element={<AdminDashboard />} />
        <Route path="/water-leakage" element={<WaterLeakage />} />
      </Routes>

      {/* Cursor outline */}
      <div
        ref={outlineRef}
        className="fixed top-0 left-0 h-10 w-10 rounded-full pointer-events-none"
        style={{
          zIndex: 9999999,
          transition: "transform 0.08s ease-out",
          border: "2px solid rgba(80,68,229,0.85)",
          boxShadow: "0 0 0 6px rgba(80,68,229,0.06)",
        }}
      />

      {/* Cursor dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-3 w-3 rounded-full pointer-events-none"
        style={{
          zIndex: 9999999,
          background: "#5044E5",
          boxShadow: "0 0 8px rgba(80,68,229,0.36)",
        }}
      />
    </>
  );
};

export default App;
