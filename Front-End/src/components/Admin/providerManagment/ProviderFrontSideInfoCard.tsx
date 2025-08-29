import type { ProviderData } from "@/shared/Types/user";
import { IoPersonCircleOutline } from "react-icons/io5";

interface ProviderFrontSideInfoCardProps {
    data: ProviderData;
    onToggleStatus: (id: string) => void
}


const ProviderFrontSideInfoCard: React.FC<ProviderFrontSideInfoCardProps> = ({ data, onToggleStatus }) => {
  return (
    <>
      {/* Top section with online badge + block button */}
      <div className="flex justify-center rounded-t-3xl relative">
        <button
          className={`text-xs md:text-sm cursor-pointer dark:text-black ${
            data.user.isBlocked ? "bg-green-600" : "bg-red-600"
          } font-semibold px-4 py-1 md:px-10 border-b border-l border-r rounded-b-2xl`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus?.(data.user.userId);
          }}
        >
          {data.user.isBlocked ? "Unblock" : "Block"}
        </button>

        <div className="absolute top-2 right-3">
          <div title={data.isOnline ? "Online" : "Offline"} className="relative flex items-center justify-center">
            {data.isOnline && (
              <span className="absolute inline-flex h-5 w-5 rounded-full bg-green-400 opacity-75 animate-ping"></span>
            )}
            <span
              className={`relative inline-block h-4 w-4 rounded-full border-2 border-white ${
                data.isOnline ? "bg-green-500" : "bg-gray-400"
              }`}
            ></span>
          </div>
        </div>
      </div>

      {/* Profile Image */}
      <div className="relative flex justify-center mt-4 max-h-44 overflow-hidden">
        { data.profileImage ? (
          <img src={data.profileImage as string} alt="user" className="w-28 h-28 object-cover rounded-full" />
        ) : (
          <IoPersonCircleOutline size={128} className="text-userIcon-text" />
        )}
      </div>

      {/* Info */}
      <h6 className="text-sm font-mono font-semibold text-center m-1 pb-2 overflow-x-auto">{data.user.email}</h6>
      <div className="flex justify-between mb-1 px-2">
        <p className="text-sm font-semibold font-mono">Service:</p>
        <p className="text-sm font-semibold">{data.service.name || "N/A"}</p>
      </div>
      <div className="flex justify-between mb-1 px-2">
        <p className="text-sm font-semibold font-mono">Name:</p>
        <p className="text-sm font-semibold">{`${data.user.fname} ${data.user.lname || ""}`}</p>
      </div>
      <div className="flex justify-between mb-1 px-2">
        <p className="text-sm font-semibold font-mono">Mobile:</p>
        <p className="text-sm font-semibold">{data.user.mobileNo || "N/A"}</p>
      </div>
      <div className="flex justify-between mb-1 px-2">
        <p className="text-sm font-semibold font-mono">Gender:</p>
        <p className="text-sm font-semibold">{data.gender || "N/A"}</p>
      </div>
    </>
  );
};

export default ProviderFrontSideInfoCard;



