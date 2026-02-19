import React from "react";
import Title from "./Title";
import assets from "../assets/assets";
import { motion } from "framer-motion";

const OurWork = () => {
  const workData = [
    {
      title: "Total Issues Detected",
      description:
        "Realtime computer-vision detections across cameras with geotags and timestamps.",
      image: assets.work_dashboard_management,
    },
    {
      title: "Resolved vs Pending",
      description:
        "Operational view for incident status, SLA tracking and response times.",
      image: assets.work_mobile_app,
    },
    {
      title: "Predictive Alerts",
      description:
        "Forecasted maintenance needs using sensor trends and historical incidents.",
      image: assets.work_fitness_app,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      id="dashboard"
      className="flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-15 sm:pt-24 lg:pt-32 text-gray-700 dark:text-white"
    >
      <div className="mt-10 sm:mt-14 lg:mt-20">
        <Title
          title="Live Monitoring & Dashboards"
          desc="Centralized analytics and operational views for municipal authorities: incidents, coverage, accuracy and uptime metrics."
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {workData.map((work, index) => (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            viewport={{ once: true }}
            key={index}
            className="hover:scale-102 duration-500 transition-all cursor-pointer"
          >
            <img src={work.image} className="w-full rounded-xl" alt="" />
            <h3 className="mt-3 mb-2 text-lg font-semibold">{work.title}</h3>
            <p className="text-sm opacity-60 w-5/6">{work.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default OurWork;
