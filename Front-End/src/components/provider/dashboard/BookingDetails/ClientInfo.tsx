import { Button } from "@/components/ui/button";
import type { AddressWithCoordinates } from "@/shared/types/location";
import { BsChatLeftText } from "react-icons/bs";

interface ClientInfoProps {
	user: {
		userId: string;
		fname: string;
		lname: string;
		email: string;
		location: AddressWithCoordinates;
	};
}

const ClientInfo: React.FC<ClientInfoProps> = ({ user }) => {
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
        >
          <BsChatLeftText /> Chat
        </Button>
      </div>

      {/* Name & Email */}
      <div className="space-y-2 sm:mt-4 sm:pt-4 border-t">
        <div className="flex items-center gap-2">
          <p className="font-semibold w-14">Name:</p>
          <p className="text-sm font-serif">{`${user.fname} ${user.lname}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="font-semibold w-14">Email:</p>
          <p className="text-sm font-serif">{user.email}</p>
        </div>
      </div>

      <div className="pt-2 mt-3 border-t">
        <p className="font-semibold">Address</p>
        <p className="text-sm pt-1 font-serif">
          {!user.location ? (
            <span>N/A</span>
          ) : (
            <>
              {user.location.houseinfo && (
                <span>{user.location.houseinfo},</span>
              )}
              {user.location.street && (
                <span>{user.location.street},</span>
              )}
              {user.location.locality && (
                <span>{user.location.locality},</span>
              )}
              <span>{user.location.city},</span>
              <br />
              <span>{user.location.district},</span>
              <span>{user.location.state}</span>
              <br />
              <span>{user.location.postalCode}</span>
            </>
          )}
        </p>
      </div>
      {/* get direction logic intigrate will google map */}
    </>
  );
};

export default ClientInfo;