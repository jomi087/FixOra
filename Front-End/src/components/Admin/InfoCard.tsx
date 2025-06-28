// src/components/admin/InfoCard.tsx

import { IoPersonCircleOutline } from "react-icons/io5";
import type { BaseUserData, ProviderData } from "@/shared/Types/user";

function isProviderData(data: BaseUserData): data is ProviderData {
  return (
    "isOnline" in data &&
    "image" in data &&
    "gender" in data &&
    "kyc" in data &&
    "serviceCharge" in data &&
    "kycInfo" in data
  );
}

interface InfoCardProps<T extends BaseUserData> {
  datas: T[];
  type: "customer" | "provider";
}

const InfoCard = <T extends BaseUserData>({ datas, type }: InfoCardProps<T>) => {
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
                  data.isBlocked ? 'bg-green-600' : 'bg-red-600'
                } font-semibold px-4 py-1 md:px-10 border-b border-l border-r rounded-b-2xl`}
              >
                {data.isBlocked ? 'Unblock' : 'Block'}
              </button>

            {type === "provider" && "isOnline" in data && (
                <div className="absolute top-2 right-3 group">
                  <div
                    title={data.isOnline ? "Online" : "Offline"}
                    className="relative flex items-center justify-center"
                  >
                    {"isOnline" in data && isProviderData(data) && data.isOnline  && (
                      <span className="absolute inline-flex h-5 w-5 rounded-full bg-green-400 opacity-75 animate-ping"></span>
                    )}
                    <span
                      className={`relative inline-block h-4 w-4 rounded-full border-2 border-white ${
                        data.isOnline ? "bg-green-500" : "bg-gray-400"
                      }`}
                    ></span>
                  </div>
                </div>
              )}
            </div>

            <div className="relative flex justify-center mt-4 max-h-44 overflow-hidden">
              {"image" in data && data.image ? (
                <img
                  src={data.image as string}
                  alt="user"
                  className="w-28 h-28 object-cover rounded-full"
                />
              ) : (
                <IoPersonCircleOutline size={128} className="text-userIcon-text" />
              )}
            </div>

             {"kycInfo" in data && isProviderData(data) && data.kycInfo.status  && (
              <span>{ data.kycInfo.status}</span>
              )}
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

export default InfoCard;
