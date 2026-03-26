import React, { useRef, useState } from "react";
import { motion } from "framer-motion";


const ServicesCard = ({service, index}) => {

    const [position, setPosition] = useState({x: 0, y: 0})
    const [visible, setVisible] = useState(false);

    const divRef = useRef(null)

    const handelMouseMove = (e) => {
        const bounds = divRef.current.getBoundingClientRect();
        setPosition({x: e.clientX - bounds.left, y: e.clientY - bounds.top})
    }

  return (
    <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.2 }}
    viewport={{once: true}}
    className="relative overflow-hidden w-full m-1 sm:m-2 md:m-4 rounded-xl border border-gray-200 dark:border-gray-700 
       shadow-xl shadow-gray-100 dark:shadow-white/10" onMouseEnter={()=> setVisible(true)} onMouseLeave={()=> setVisible(false)} ref={divRef} onMouseMove={handelMouseMove}>
         
         <div className={`pointer-events-none blur-2xl rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 w-[300px] h-[300px] absolute z-0 transition-opacity duration-500 mix-blend-lighten ${visible ? 'opacity-70' : 'opacity-0'} `} style={{ top: position.y - 150, left: position.x - 150}} />

            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-10 p-4 md:p-8 hover:p-3.5 md:hover:p-7.5 hover:m-0.5 transition-all rounded-[10px] bg-white dark:bg-gray-900 z-10 relative h-full">

                <div className="bg-gray-100 dark:bg-gray-700 rounded-full shrink-0">
                    <img src={service.icon} alt="" className="w-12 h-12 md:max-w-24 md:h-auto bg-white dark:bg-gray-900 rounded-full m-2"/>
                </div>
                <div className="flex-1 text-center md:text-left flex flex-col justify-center">
                    <h3 className="font-bold text-sm md:text-base leading-tight">{service.title}</h3>
                    <p className="text-xs md:text-sm mt-1 md:mt-2 line-clamp-3 md:line-clamp-none">{service.description}</p>
                </div>
            </div>
    </motion.div>
  );
};

export default ServicesCard;
