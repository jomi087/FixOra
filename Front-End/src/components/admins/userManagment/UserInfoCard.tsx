import type { CustomersData } from "@/shared/types/user";
import React from "react";
import { IoPersonCircleOutline } from "react-icons/io5";


interface InfoCardProps {
  datas: CustomersData[];
  onToggleStatus : ( id : string ) => void
}

const UserInfoCard:React.FC<InfoCardProps> = ({ datas, onToggleStatus }) => {

  return (
    <div className="flex flex-wrap justify-center gap-6 px-4 py-6 max-w-7xl mx-auto">
      {datas.map((data) => (
        <div
          key={data.email}
          className="w-full sm:w-[45%] md:w-[30%] lg:w-[23%] transition-transform duration-300 hover:scale-105"
        >
          <div className="relative rounded-3xl cursor-pointer border border-gray-300 dark:border-white/20 shadow-lg shadow-black pb-2">
            <div className="flex justify-center rounded-t-3xl">
              <button
                className={`text-xs md:text-sm cursor-pointer dark:text-black ${
                  data.isBlocked ? "bg-green-600" : "bg-red-600"
                } font-semibold px-4 py-1 md:px-10 border-b border-l border-r rounded-b-2xl`}
                onClick={ (e) => {
                  e.stopPropagation();
                  onToggleStatus?.(data.userId);
                }}
              >
                {data.isBlocked ? "Unblock" : "Block"}
              </button>

            </div>

            <div className="relative flex justify-center mt-4 max-h-44 overflow-hidden">
              <IoPersonCircleOutline size={128} className="text-userIcon-text" />
            </div>

            <h6 className="text-sm font-mono text-center m-2 pb-2 overflow-x-auto">
              {data.email}
            </h6>

            <div className="flex justify-between mb-1 px-2">
              <p className="text-sm font-semibold font-mono">Full Name:</p>
              <p className="text-sm font-semibold">{`${data.fname} ${data.lname || ""}`}</p>
            </div>

            <div className="flex justify-between mb-1 px-2">
              <p className="text-sm font-semibold font-mono">Mobile:</p>
              <p className="text-sm font-semibold">{data.mobileNo || "N/A"}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default React.memo(UserInfoCard);
