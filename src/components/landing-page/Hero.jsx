import React from "react";
import assets from "../../assets/assets";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div
      id="hero"
      className="flex flex-col items-center gap-6 pt-12 sm:pt-16 pb-20 px-4 sm:px-12 lg:px-24 xl:px-40 text-center w-full overflow-hidden text-gray-700 dark:text-white"
    >
      {/* Added margin-top (pt-32) to create space between navbar and this section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        viewport={{ once: true }}
        className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-700 p-2 pr-5 rounded-full bg-white/50 dark:bg-gray-900/30 backdrop-blur-sm"
      >
        <img className="w-7" src={assets.group_profile} alt="" />
        <p className="text-sm sm:text-base font-medium text-gray-700 dark:text-gray-300">
          Designed for Smart City Infrastructure
        </p>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        viewport={{ once: true }}
        className="text-4xl sm:text-5xl md:text-6xl xl:text-[72px] font-medium xl:leading-[82px] max-w-5xl mt-4"
      >
        Building Smarter Cities Through{" "}
        <span className="bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent">
          AI-Driven
        </span>{" "}
        Infrastructure Monitoring.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1 }}
        viewport={{ once: true }}
        className="text-lg sm:text-xl font-medium text-gray-500 dark:text-white/75 max-w-2xl pb-3 mt-6"
      >
        Detect, analyze, and respond to urban issues in real time using AI and
        IoT.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 2 }}
        viewport={{ once: true }}
        className="relative mt-8 w-full"
      >
        <img
          src={assets.hero_img}
          alt="Hero visualization"
          className="w-full relative z-10 rounded-2xl shadow-2xl"
        />
        <img
          src={assets.bgImage2}
          alt="Background decoration"
          className="absolute -top-40 -right-40 sm:-top-100 sm:-right-70 -z-10 dark:hidden"
        />
      </motion.div>
    </div>
  );
};

export default Hero;
