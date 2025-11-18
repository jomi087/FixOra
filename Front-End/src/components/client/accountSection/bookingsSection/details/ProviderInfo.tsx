import { Button } from "@/components/ui/button";
import AuthService from "@/services/AuthService";
import { Messages } from "@/utils/constant";
import type { AxiosError } from "axios";
import { BsChatLeftText } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface ClientInfoProps {
  providerUser: {
    userId: string;
    fname: string;
    lname: string;
    email: string;
    image: string;
  };
}

const ProviderInfo: React.FC<ClientInfoProps> = ({ providerUser }) => {
  const navigate = useNavigate();
  console.log(providerUser);

  const handleChat = async () => {
    try {
      await AuthService.startChatWithProvider(providerUser.userId);
      navigate("/customer/account/chats");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg =
        err.response?.data?.message || Messages.FAILED_TO_FETCH_DATA;
      toast.error(errorMsg);
    }
  };

  return (
    <>
      <h3 className="text-lg font-bold text-center underline underline-offset-4 text-nav-text">Provider Information</h3>

      <div className="flex flex-col items-center mt-5">
        <div className="rounded-full flex items-center justify-center">
          <img
            src={providerUser.image}
            alt="profile image"
            className="h-55 sm:h-50 md:h-65 lg-h-75 rounded-full"
          />
        </div>

      </div>

      <div className="-mt-4 flex justify-end ">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleChat}        >
          <BsChatLeftText /> Chat
        </Button>
      </div>

      {/* Name & Email */}
      <div className="space-y-2 sm:mt-4 sm:pt-4 border-t">
        <div className="flex items-center gap-2">
          <p className="font-semibold w-14">Name:</p>
          <p className="text-sm font-serif">{`${providerUser.fname} ${providerUser.lname}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-semibold w-14">Email:</p>
          <p className="text-sm font-serif">{providerUser.email}</p>
        </div>
      </div>

      {/* <div className="pt-2 mt-3 border-t">
        <p className="font-semibold">Address</p>
        <p className="text-sm pt-1 font-serif">
          {!providerUser.location ? (
            <span>N/A</span>
          ) : (
            <>
              {providerUser.location.houseinfo && (
                <span>{providerUser.location.houseinfo},</span>
              )}
              {providerUser.location.street && (
                <span>{providerUser.location.street},</span>
              )}
              {providerUser.location.locality && (
                <span>{providerUser.location.locality},</span>
              )}
              <span>{providerUser.location.city},</span>
              <br />
              <span>{providerUser.location.district},</span>
              <span>{providerUser.location.state}</span>
              <br />
              <span>{providerUser.location.postalCode}</span>
            </>
          )}
        </p>
      </div> */}
    </>
  );
};

export default ProviderInfo;