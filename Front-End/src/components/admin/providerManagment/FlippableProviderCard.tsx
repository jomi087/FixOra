import type { ProviderData } from "@/shared/types/user";
import React, { useState } from "react";
import ProviderFrontSideInfoCard from "./ProviderFrontSideInfoCard";
import ProviderBackSideInfoCard from "./ProviderBackSideInfoCard";

interface FlippableProviderCardProps {
    data: ProviderData;
    onToggleStatus: (id: string) => void
}


const FlippableProviderCard: React.FC<FlippableProviderCardProps> = ({ data, onToggleStatus }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="w-full sm:w-[45%] md:w-[30%] lg:w-[23%] [perspective:1000px] cursor-pointer"
      onClick={() => setFlipped((prev) => !prev)} // Flip on click
    >
      <div
        className={`relative w-full h-75 transition-transform duration-700 [transform-style:preserve-3d] ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front Side */}
        <div className="absolute w-full h-full rounded-3xl border border-gray-300 dark:border-white/20 shadow-lg shadow-black bg-white dark:bg-gray-900 backface-hidden">
          <ProviderFrontSideInfoCard data={data} onToggleStatus={onToggleStatus} />
        </div> 

        {/* Back Side */}
        <div className="absolute w-full h-full  rounded-3xl border border-gray-300 dark:border-white/20 shadow-lg shadow-black bg-gray-100 dark:bg-gray-800 [transform:rotateY(180deg)] backface-hidden p-4">
          <ProviderBackSideInfoCard data={data} />
        </div>
      </div>
    </div>
  );
};

export default FlippableProviderCard;


