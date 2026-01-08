import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import "@fontsource-variable/inter";

const IntroLoader = ({ onComplete }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(-1); // Start at -1 so nothing shows initially
  const [showLoader, setShowLoader] = useState(true);

  // Text sequences
  const line1 = ["INTRODUCING"];
  const line2 = ["Infra", "Vision"];
  const line3 = ["AI-Powered", "Smart", "City", "Infrastructure", "Monitoring"];

  // Calculate total words for timing
  const totalWords = line1.length + line2.length + line3.length;
  const wordDelay = 400; // ms between words
  const holdDuration = 1500; // ms to hold final text
  const fadeOutDuration = 800; // ms for fade out

  useEffect(() => {
    // Start animation - show first word after initial delay
    if (currentWordIndex < totalWords - 1) {
      let delay;

      if (currentWordIndex === -1) {
        // Initial delay before showing first word
        delay = 200;
      } else if (currentWordIndex === 0) {
        // Delay after "INTRODUCING" before "Infra"
        delay = 500;
      } else if (currentWordIndex === 1) {
        // Delay after "Infra" before "Vision" - make it smooth
        delay = 500;
      } else {
        // Standard delay for other words
        delay = wordDelay;
      }

      const timer = setTimeout(() => {
        setCurrentWordIndex((prev) => prev + 1);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      // All words shown (currentWordIndex === totalWords - 1), wait then fade out
      const timer = setTimeout(() => {
        setShowLoader(false);
        setTimeout(() => {
          onComplete();
        }, fadeOutDuration);
      }, holdDuration);
      return () => clearTimeout(timer);
    }
  }, [currentWordIndex, totalWords, onComplete]);

  const getWordIndex = (line, wordIndex) => {
    let index = 0;
    if (line === line1) return wordIndex;
    if (line === line2) return line1.length + wordIndex;
    if (line === line3) return line1.length + line2.length + wordIndex;
    return index;
  };

  const wordVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94], // ease-out cubic-bezier
      },
    },
  };

  const containerVariants = {
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  if (!showLoader) {
    return null;
  }

  return (
    <motion.div
      className="flex flex-col items-center justify-center text-center px-6"
      style={{
        fontFamily:
          "'Inter Variable', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        width: "100%",
        height: "100%",
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Line 1: INTRODUCING */}
      <div className="mb-6 md:mb-8">
        {line1.map((word, index) => {
          const globalIndex = getWordIndex(line1, index);
          const isVisible = currentWordIndex >= globalIndex;
          return (
            <motion.span
              key={`line1-${index}`}
              className="text-xs md:text-sm text-white/50 tracking-[0.3em] font-light uppercase"
              variants={wordVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            >
              {word}
            </motion.span>
          );
        })}
      </div>

      {/* Line 2: InfraVision with gradient */}
      <div className="mb-8 md:mb-10">
        {line2.map((word, index) => {
          const globalIndex = getWordIndex(line2, index);
          const isVisible = currentWordIndex >= globalIndex;
          return (
            <motion.span
              key={`line2-${index}`}
              className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight"
              variants={wordVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            >
              <span
                className={
                  word === "Vision"
                    ? "bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500 bg-clip-text text-transparent"
                    : "text-white"
                }
              >
                {word}
              </span>
            </motion.span>
          );
        })}
      </div>

      {/* Line 3: Tagline */}
      <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 max-w-4xl">
        {line3.map((word, index) => {
          const globalIndex = getWordIndex(line3, index);
          const isVisible = currentWordIndex >= globalIndex;
          return (
            <motion.span
              key={`line3-${index}`}
              className="text-base md:text-xl lg:text-2xl text-white/70 font-medium"
              variants={wordVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
            >
              {word}
            </motion.span>
          );
        })}
      </div>
    </motion.div>
  );
};

export default IntroLoader;
