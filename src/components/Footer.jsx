import React from "react";
import assets from "../assets/assets";
import { motion } from "framer-motion";

const Footer = () => {
  const productLinks = [
    { label: "Features", href: "#features" },
    { label: "Modules", href: "#modules" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Dashboard", href: "#dashboard" },
  ];

  const socialLinks = [
    { name: "GitHub", icon: "github", href: "#" },
    { name: "LinkedIn", icon: assets.linkedin_icon, href: "#" },
    { name: "Instagram", icon: assets.instagram_icon, href: "#" },
    { name: "X", icon: assets.twitter_icon, href: "#" },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
      viewport={{ once: true }}
      className="relative overflow-hidden mt-10 sm:mt-16"
      style={{
        background: "linear-gradient(180deg, #0b1220 0%, #05070f 100%)",
      }}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#5044E5]/5 to-transparent pointer-events-none" />

      <div className="relative z-10 px-4 sm:px-8 lg:px-16 xl:px-24 2xl:px-40 pt-16 pb-8">
        {/* 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-8 mb-12">
          {/* Column 1: Brand */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <div className="space-y-3">
              <h3 className="text-2xl font-bold text-white relative inline-block">
                Infra
                <span className="bg-gradient-to-r from-[#5044E5] to-[#4d8cea] bg-clip-text text-transparent">
                  Vision
                </span>
                {/* Subtle glow accent */}
                <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-gradient-to-r from-[#5044E5]/60 via-[#4d8cea]/60 to-transparent rounded-full blur-sm" />
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
                AI-powered platform for real-time public infrastructure
                monitoring and smart city intelligence.
              </p>
            </div>
          </motion.div>

          {/* Column 2: Product */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Product
            </h4>
            <ul className="space-y-3">
              {productLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="group relative inline-block text-sm text-gray-400 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-gradient-to-r from-[#5044E5] to-[#4d8cea] group-hover:w-full transition-all duration-300" />
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Column 3: Project Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider">
              Project
            </h4>
            <div className="space-y-3 text-sm text-gray-400">
              <p>Final Year Project</p>
              <p>Department of Computer Engineering</p>
              <p>Academic Year 2025</p>
              <p className="text-xs text-gray-500 mt-4">
                Built using AI, IoT, and Computer Vision
              </p>
            </div>
          </motion.div>
        </div>

        {/* Connect Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
            Connect
          </h4>
          <div className="flex flex-wrap gap-3">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="group relative w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm bg-white/5 border border-white/10 hover:border-[#5044E5]/50 hover:bg-[#5044E5]/10 transition-all duration-300"
                style={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                {social.icon === "github" ? (
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-[#5044E5] transition-colors duration-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                ) : (
                  <img
                    src={social.icon}
                    alt={social.name}
                    className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                  />
                )}
                {/* Glow effect on hover */}
                <span className="absolute inset-0 rounded-full bg-gradient-to-r from-[#5044E5]/0 to-[#4d8cea]/0 group-hover:from-[#5044E5]/20 group-hover:to-[#4d8cea]/20 blur-md transition-all duration-300 -z-10" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-gray-700/50 to-transparent mb-8"
        />

        {/* Copyright Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500"
        >
          <p>© 2025 InfraVision. All rights reserved.</p>
          <div className="flex items-center gap-2 text-gray-600">
            <span>Made with</span>
            <span className="text-red-500">♥</span>
            <span>for Smart Cities</span>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;
