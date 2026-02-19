import React from "react";
import assets from "../assets/assets";
import Title from "./Title";
import ServicesCard from "./ServicesCard";
import { motion } from "framer-motion";

const Services = () => {
  const servicesData = [
    {
      title: "Road Damage Monitoring",
      description:
        "AI-driven detection of potholes and cracks from street cameras; geo-tagged issues for repair teams.",
      icon: assets.ads_icon,
    },
    {
      title: "Smart Streetlight Monitoring",
      description:
        "IoT + vision to detect faulty luminaires and schedule maintenance automatically.",
      icon: assets.marketing_icon,
    },
    {
      title: "Water Leakage Detection",
      description:
        "Camera and sensor fusion to identify leaks and anomalies in water infrastructure.",
      icon: assets.content_icon,
    },
    {
      title: "Public Facility Monitoring",
      description:
        "AI checks for cleanliness, vandalism, and occupancy at public facilities for rapid response.",
      icon: assets.social_icon,
    },
    {
      title: "Predictive Maintenance",
      description:
        "Analytics and forecasting to prioritize interventions and extend asset life.",
      icon: assets.ads_icon,
    },
    {
      title: "Environmental Monitoring",
      description:
        "Sensor-driven air, noise and water quality monitoring with alerts and trend reporting.",
      icon: assets.marketing_icon,
    },
  ];

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.2 }}
      id="modules"
      className="relative  flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-30 text-gray-700 dark:text-white"
    >
      <img
        src={assets.bgImage2}
        alt=""
        className="absolute -top-110 -left-70 z-1 dark:hidden"
      />

      <div className="z-10">
        <Title
          title="Core Modules"
          desc="AI + IoT modules designed for real-world infrastructure monitoring: detection, telemetry, analytics and citizen reporting."
        />
      </div>
      <div className="flex flex-col md:grid grid-cols-2">
        {servicesData.map((service, index) => (
          <ServicesCard key={index} service={service} index={index} />
        ))}
      </div>
    </motion.div>
  );
};

export default Services;
