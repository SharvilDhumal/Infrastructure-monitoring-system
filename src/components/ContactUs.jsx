import React from "react";
import assets from "../assets/assets";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import GlobeCanvas from "./GlobeCanvas";

const ContactUs = () => {
  const onSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    formData.append("access_key", "2738e7c3-8bc9-46d4-acac-071c74d03fa6");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Thank you for your message!");
        event.target.reset();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      id="contact-us"
      className="flex flex-col lg:flex-row items-center lg:items-start gap-12 px-4 sm:px-12 lg:px-24 xl:px-40 pt-20 sm:pt-24 lg:pt-28 pb-20 text-gray-700 dark:text-white"
    >
      {/* Left Side - Contact Form */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="w-full lg:w-1/2 max-w-lg"
      >
        <div className="mb-8">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-sm text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider"
          >
            GET IN TOUCH
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8"
          >
            Contact.
          </motion.h2>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          onSubmit={onSubmit}
          className="space-y-6"
        >
          <div>
            <input
              type="text"
              name="name"
              placeholder="What's your name?"
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#5044E5] focus:ring-2 focus:ring-[#5044E5]/20 transition-all"
              required
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="What's your email?"
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#5044E5] focus:ring-2 focus:ring-[#5044E5]/20 transition-all"
              required
            />
          </div>

          <div>
            <textarea
              rows={6}
              name="message"
              placeholder="What do you want to say?"
              className="w-full px-4 py-4 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-[#5044E5] focus:ring-2 focus:ring-[#5044E5]/20 transition-all resize-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#5044E5] to-[#4d8cea] text-white rounded-lg font-medium hover:scale-105 transition-all duration-200 shadow-lg shadow-[#5044E5]/30"
          >
            Send
          </button>
        </motion.form>
      </motion.div>

      {/* Right Side - Globe Canvas */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="w-full lg:w-1/2 max-w-[520px] h-[300px] md:h-[380px] lg:h-[420px] xl:h-[460px] flex items-center justify-center"
      >
        <GlobeCanvas />
      </motion.div>
    </motion.div>
  );
};

export default ContactUs;
