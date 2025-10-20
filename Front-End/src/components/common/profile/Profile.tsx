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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { toPascalCase } from "@/utils/helper/utils";

interface ProfileProps {
  toggle?: (editMode: boolean) => void;
}

const Profile: React.FC<ProfileProps> = ({ toggle }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);

  if (user?.role === RoleEnum.CUSTOMER && !toggle) return null;

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
      const msg =
        err?.response?.data?.message ||
        Messages.FAILED_PASSWORD_VERIFICATION;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 px-6 pt-6 max-w-4xl mx-auto text-nav-text">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>

        {user?.role === RoleEnum.PROVIDER && (
          <Button
            variant="link"
            className="text-sm text-primary hover:underline hover:scale-105 transition-transform"
            onClick={() => navigate("/provider/settings/advance-profile")}
          >
            Advance Settings →
          </Button>
        )}
      </div>

      {/* Profile Card */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-8 rounded-2xl shadow-md border border-gray-200 bg-white dark:bg-gray-900">
        {/* Left: Avatar & Name */}
        <div className="flex flex-col items-center text-center md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
          {user?.fname ? (
            <div className="flex items-center justify-center w-28 h-28 md:w-32 md:h-32 border-2 border-primary rounded-full shadow-xl bg-primary-foreground">
              <span className="text-5xl md:text-6xl font-bold text-primary">
                {user.fname[0]?.toUpperCase()}
              </span>
            </div>
          ) : (
            <HiUserCircle size={130} className="text-gray-400" />
          )}

          <h3 className="text-xl font-semibold mt-4 flex items-center gap-2">
            {`${toPascalCase(user?.fname ?? "")} ${user?.lname ?? ""}`}
            {user?.role === RoleEnum.CUSTOMER && toggle && (
              <CiEdit
                size={20}
                className="cursor-pointer text-gray-500 hover:text-primary transition-colors"
                onClick={() => toggle(true)}
              />
            )}
          </h3>
          <p className="text-primary text-sm mt-1">{user?.email}</p>
        </div>

        {/* Right: Info Fields */}
        <div className="flex-1 w-full md:w-2/3 space-y-6">
          {/* Email */}
          <div className="flex flex-col">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              Email
            </p>
            <p className="ml-4 text-gray-600 dark:text-gray-400">
              {user?.email || "N/A"}
            </p>
          </div>

          {/* Mobile */}
          <div className="flex flex-col">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              Mobile
            </p>
            <p className="ml-4 text-gray-600 dark:text-gray-400">
              {user?.mobileNo || "N/A"}
            </p>
          </div>

          {/* Address */}
          <div className="flex flex-col">
            <p className="font-medium text-gray-700 dark:text-gray-200">
              Address
            </p>
            <p className="ml-4 text-gray-600 dark:text-gray-400">
              {user?.location
                ? getFormattedAddress(user.location)
                : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Dialog */}
      <div className="flex justify-end mt-6">
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
