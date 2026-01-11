import { useEffect, useRef } from "react";
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

const App = () => {
  // Force dark mode (project design choice)
  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const dotRef = useRef(null);
  const outlineRef = useRef(null);

  // Mouse tracking for custom cursor
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
        dotRef.current.style.transform = `translate3d(${
          mouse.current.x - 6
        }px, ${mouse.current.y - 6}px, 0)`;

        outlineRef.current.style.transform = `translate3d(${
          position.current.x - 20
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
      <LoaderWrapper>
        {/* Page content */}
        <div className="relative bg-black transition-colors pt-16 sm:pt-20">
          <Toaster />
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

      {/* Custom cursor outline */}
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

      {/* Custom cursor dot */}
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
