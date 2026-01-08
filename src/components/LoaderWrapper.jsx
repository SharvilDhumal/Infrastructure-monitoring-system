import React, { useState } from "react";
import { motion } from "framer-motion";
import IntroLoader from "./IntroLoader";

const LoaderWrapper = ({ children }) => {
  const [showLoader, setShowLoader] = useState(true); // Always start with loader visible
  const [showContent, setShowContent] = useState(false);

  const handleLoaderComplete = () => {
    setShowLoader(false);
    // Small delay before showing content for smooth transition
    setTimeout(() => {
      setShowContent(true);
    }, 300);
  };

  return (
    <>
      {/* Loader - Always on top when active, covers entire screen */}
      {showLoader && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 999999,
            backgroundColor: "#05070f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "auto",
          }}
        >
          <IntroLoader onComplete={handleLoaderComplete} />
        </div>
      )}

      {/* Content - Only show when loader is completely done */}
      {!showLoader && showContent && (
        <motion.div
          key="main-content"
          initial={{ opacity: 0, filter: "blur(10px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          style={{ width: "100%", minHeight: "100vh" }}
        >
          {children}
        </motion.div>
      )}
    </>
  );
};

export default LoaderWrapper;
