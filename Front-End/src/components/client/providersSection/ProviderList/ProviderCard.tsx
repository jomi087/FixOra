import renderStars from "@/components/common/others/StarRating";
import type { ActiveProvider } from "@/shared/types/user";
import { toPascalCase } from "@/utils/helper/utils";
import { IoPersonCircleOutline } from "react-icons/io5";
import { GrContactInfo } from "react-icons/gr";
import { useNavigate } from "react-router-dom";

interface ProvderCardProps {
    datas : ActiveProvider[]
}

const ProviderCard: React.FC<ProvderCardProps> = ({ datas }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-wrap justify-center gap-6 px-4 py-6 max-w-7xl mx-auto">
      {datas.map((data) => (
        <div
          key={data.providerId}
          className="w-full sm:w-[45%] md:w-[30%] lg:w-[23%] transition-transform duration-300 hover:scale-105"
          onClick={()=>navigate(`/customer/providers/provider-booking/${data.providerId}`)}
        >
          <div className="relative rounded-3xl cursor-pointer border border-gray-300 dark:border-white/20 shadow-lg shadow-black pb-2">
            <div className="flex justify-around  rounded-t-3xl">
              <div className=" inline-block group pl-2 pt-3">  
                <GrContactInfo size={18} />
                <div className="absolute left-3 top-9 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out  min-w-[150px] rounded-md border border-gray-300 bg-foreground text-primary-foreground p-2 shadow-md z-50">
                  <ul>
                    {data.service.subcategories.map((sub) => (
                      <li key={sub.subCategoryId} className="text-[12px]">{toPascalCase(sub.name)}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <button
                className={"text-xs md:text-sm font-semibold px-4 pt-2  "}
              >
                {`${toPascalCase(data.service.name)}`}
              </button>

              <div className="pr-2 pt-3">
                <div
                  title={data.isOnline ? "Online" : "Offline"}
                  className="relative flex items-center justify-center"
                >
                  { data.isOnline  && (
                    <span className="absolute inline-flex h-5 w-5 rounded-full bg-green-400 opacity-75 animate-ping"/>
                  )}
                  <span
                    className={`relative inline-block h-4 w-4 rounded-full border-2 border-white ${
                      data.isOnline ? "bg-green-500" : "bg-gray-400"}`}
                  />
                </div>
              </div>
            </div>

            <div className="relative flex justify-center mt-4 max-h-44 overflow-hidden">
              {data.profileImage ? (
                <img
                  src={data.profileImage as string}
                  alt="Provider profile image"
                  className="w-28 h-28 object-cover rounded-full"
                />
              ) : (
                <IoPersonCircleOutline size={128} className="text-userIcon-text" />
              )}
            </div>
                      
            <h6 className="text-sm font-mono text-center m-2 py-2  overflow-x-auto">
              {`${toPascalCase(data.user.fname)} ${toPascalCase(data.user.lname)}`}
            </h6>

            <div className="flex justify-between items-center mb-2 px-2">
              <p className="text-sm font-semibold font-mono">Gender:</p>
              <p className="text-sm font-semibold">
                {data.gender ? `${data.gender}`: "N/A"}
              </p>
            </div>

            <div className="flex justify-between items-center mb-2 px-2">
              <p className="text-sm font-semibold font-mono">Service Charge:</p>
              <p className="text-sm font-semibold">
                {data.serviceCharge ? `₹${data.serviceCharge}` : "N/A"}
              </p>
            </div>

            <div className="flex justify-between items-center mb-2 px-2">
              <p className="text-sm font-semibold font-mono">Rating:</p>
              {data.totalRatings >= 0 ? (
                <div className="flex items-center space-x-1">
                  <div className="flex">{ Math.floor(data.averageRating * 2) / 2 }</div>
                  <div className="flex">{renderStars(data.averageRating ?? 0)}</div>
                  <span className="text-xs text-gray-500">
                    ({data.totalRatings})
                  </span>
                </div>
              ) : (
                <p className="text-sm italic text-gray-400">No ratings yet</p>
              )}
            </div>

          </div>
        </div>
      ))}
    </div>
  );
};

export default ProviderCard;