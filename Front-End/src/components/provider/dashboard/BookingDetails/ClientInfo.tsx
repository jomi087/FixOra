import { Button } from "@/components/ui/button";
import AuthService from "@/services/AuthService";
import type { AppLocation } from "@/shared/typess/location";
import { Messages } from "@/utils/constant";
import { toPascalCase } from "@/utils/helper/utils";
import type { AxiosError } from "axios";
import { MapPin } from "lucide-react";
import { BsChatLeftText } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import MapAnimation from "@/assets/animations/Map Location.json";
import Lottie from "lottie-react";


interface ClientInfoProps {
  user: {
    userId: string;
    fname: string;
    lname: string;
    email: string;
    location: AppLocation;
  };
}

const ClientInfo: React.FC<ClientInfoProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleChat = async () => {
    try {
      await AuthService.startChatWithUser(user.userId);
      navigate("/provider/chats");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg =
        err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      toast.error(errorMsg);
    }

  };
  return (
    <>
      <h3 className="text-lg font-bold text-center underline underline-offset-4 text-nav-text">Client Information</h3>

      <div className="flex flex-col items-center mt-5">
        <div className="w-16 sm:w-24 h-16 sm:h-24 rounded-full shadow-md shadow-chart-4  border-3 border-ring flex items-center justify-center [transition:transform_2s] hover:[transform:rotateY(180deg)] cursor-pointer ">
          <span className="text-3xl sm:text-5xl font-mono">{user.fname[0]?.toUpperCase()}</span>
        </div>
      </div>

      <div className="-mt-4 flex justify-end ">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleChat}
        >
          <BsChatLeftText /> Chat
        </Button>
      </div>

      {/* Name & Email */}
      <div className="space-y-2 sm:mt-4 sm:pt-4 border-t">
        <div className="flex items-center gap-2">
          <p className="font-semibold w-14">Name:</p>
          <p className="text-sm font-serif">{`${toPascalCase(user.fname)} ${toPascalCase(user.lname)}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-semibold w-14">Email:</p>
          <p className="text-sm font-serif">{user.email}</p>
        </div>
      </div>

      <div className="pt-4 mt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-5 h-5" />
          <h3 className="font-semibold ">Address</h3>
        </div>
        {!user?.location ? (
          <div className="flex items-center gap-2  ml-7">
            <span className="text-sm">No address available</span>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="ml-7">

              <p className="text-sm text-primary leading-relaxed font-serif">
                {user.location.address}
              </p>
            </div>
            <div className="border-t border-b border-primary rounded-lg relative">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${user.location.lat},${user.location.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-end gap-3 px-4 py-2 text-sm font-medium w-full "
              >
                {/* <Navigation className="w-4 h-4" /> */}
                <p className="text-[12px] font-roboto absolute top-2 right-2">Click for direction</p>
                <Lottie
                  animationData={MapAnimation}
                  loop={true}
                  className=""
                />
              </a>
            </div>

          </div>

        )}

      </div>

      {/* get direction logic intigrate will google map */}
    </>
  );
};

export default ClientInfo;