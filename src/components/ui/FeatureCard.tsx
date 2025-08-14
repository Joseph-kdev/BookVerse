import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  image: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  image,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-[#000000] transition-shadow duration-300 flex flex-col items-start overflow-hidden md:h-[60vh]">
      <div className="p-3 rounded-lg mb-4 h-[220px] md:h-auto overflow-hidden relative">
        <motion.img whileHover={{ y:-20 }} src={image} className="" />
      </div>
      <div className="bg-white mt-2">
        <h3 className="text-lg font-semibold text-navy-900 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
