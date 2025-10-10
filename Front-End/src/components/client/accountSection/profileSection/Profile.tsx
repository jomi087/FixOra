import { HiUserCircle } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";
import { useAppSelector } from "@/store/hooks";
import { getFormattedAddress } from "@/utils/helper/formatedAddress";
import { useState } from "react";
import AuthService from "@/services/AuthService";
import { toast } from "react-toastify";
import ChangePassowrdDialog from "./ChangePassowrdDialog";
import { validatePassword } from "@/utils/validation/formValidation";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { Messages } from "@/utils/constant";
import { RoleEnum } from "@/shared/enums/roles";
import type { AxiosError } from "axios";

interface ProfileProps {
  toggle?: (editMode: boolean) => void;
}

const Profile: React.FC<ProfileProps> = ({ toggle }) => {

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  console.log("user",user);
  if (user?.role === RoleEnum.CUSTOMER && !toggle) {
    throw new Error(" The 'toggle' prop is required ");
  }

  const handleChangePassword = async (password: string) => {
    const error = validatePassword(password);
    if (error) {
      setErrorMsg(error);
      return;
    }
    setErrorMsg("");
    setLoading(true);
    try {
      const res = await AuthService.verifyPasswordApi(password);
      if (res.status === HttpStatusCode.OK) {
        toast.success(res.data.message || Messages.MAIL_SENT_MSG);
      }
      setIsDialogOpen(false);
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMsg = err?.response?.data?.message || Messages.FAILED_PASSWORD_VERIFICATION;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 px-6 pt-6 max-w-4xl mx-auto text-nav-text">
      <h2 className="text-3xl font-bold mb-8">My Profile</h2>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-10 rounded-xl shadow-lg border border-gray-200 bg-white dark:bg-gray-900 cursor-context-menu">
        {/* Profile Image & Name */}
        <div className="flex flex-col items-center text-center md:w-1/2 md:border-r-2">
          {user?.fname ? (
            <div className="flex items-center justify-center w-[88px] h-[88px] md:w-[132px] md:h-[132px] border-2 rounded-full shadow-2xl bg-primary text-primary-foreground">
              <span className="text-6xl sm:text-7xl md:text-8xl font-bold">
                {user.fname[0]?.toUpperCase()}
              </span>
            </div>
          ) : (
            <HiUserCircle size={160} className="text-userIcon-text" />
          )}

          <h3 className="text-xl font-semibold mt-4 flex items-center gap-2 ">
            {`${user?.fname} ${user?.lname || ""} `}
            {user?.role === RoleEnum.CUSTOMER && toggle && (
              <CiEdit
                size={20}
                className="cursor-pointer text-gray-500 hover:text-primary"
                onClick={() => toggle(true)}
              />
            )}
          </h3>
        </div>
        {/* Info Section */}
        <div className="md:w-2/3 space-y-4 text-sm md:text-base md:mt-8">
          <div>
            <span className="font-semibold">Email:</span>
            <p className="text-gray-600 dark:text-white ml-5">{`${user?.email}`}</p>
          </div>

          <div>
            <span className="font-semibold">Mobile:</span>
            <p className="text-gray-600 dark:text-white ml-5">{`${user?.mobileNo ? user.mobileNo : "N/A"}`}</p>
          </div>

          <div>
            <span className="font-semibold">Address:</span>
            <p className="text-gray-600 dark:text-white ml-5">{`${user?.location ? getFormattedAddress(user.location) : "N/A"}`} </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <ChangePassowrdDialog
          changePassword={handleChangePassword}
          errorMsg={errorMsg}
          setErrorMsg={setErrorMsg}
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default Profile;
