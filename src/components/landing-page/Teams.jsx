import React from "react";
import Title from "./Title";
import { teamData } from "../../assets/assets";
import { motion } from "framer-motion";

const Teams = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex flex-col items-center gap-7 px-4 sm:px-12 lg:px-24 xl:px-40 pt-20 sm:pt-24 lg:pt-28 text-gray-800 dark:text-white"
    >
      <Title
        title="Meet the team"
        desc="A passionate team of digital experts dedicated to your brand’s success."
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 w-full">
        {teamData.map((team, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            viewport={{ once: true }}
            key={index}
            className="flex flex-col sm:flex-row items-center gap-2 sm:gap-5 p-3 sm:p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl shadow-gray-100 dark:shadow-white/5 hover:scale-103 transition-all duration-400 text-center sm:text-left h-full"
          >
            <img src={team.image} className="w-12 h-12 md:w-16 md:h-16 rounded-full shrink-0" alt="" />
            <div className="flex-1 flex flex-col justify-center">
              <h3 className="font-bold text-sm md:text-base">{team.name}</h3>
              <p className="text-xs md:text-sm opacity-60 mt-1">{team.title}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Teams;
