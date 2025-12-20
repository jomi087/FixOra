import { HiUserCircle } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getFormattedAddress } from "@/utils/helper/formatedAddress";
import { useState } from "react";
import AuthService from "@/services/AuthService";
import { toast } from "react-toastify";
import ChangePassowrdDialog from "./ChangePassowrdDialog";
import { validateEmail, validatePassword } from "@/utils/validation/formValidation";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { Messages, shortInputLength } from "@/utils/constant";
import { RoleEnum } from "@/shared/enums/Role";
import type { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { toPascalCase } from "@/utils/helper/utils";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Otp from "@/components/auth/Otp";
import { logout } from "@/store/common/userSlice";

interface ProfileProps {
  toggle?: (editMode: boolean) => void;
}

const Profile: React.FC<ProfileProps> = ({ toggle }) => {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [verified, setVerified] = useState(false);

  const navigate = useNavigate();

  const [loadingVerify, setLoadingVerify] = useState(false);

  const { user } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState(user?.email || "");
  const dispatch = useAppDispatch();


  if ((user?.role === RoleEnum.CUSTOMER || user?.role === RoleEnum.ADMIN) && !toggle) return null;

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

  const handleVerifyEmail = async () => {

    if (email === user?.email) {
      toast.info("No changes Made.");
      return;
    }

    const emailError = validateEmail(email);
    if (emailError) {
      toast.error(emailError);
      return;
    }
    setLoadingVerify(true);
    try {
      await AuthService.updateEmail(email);
      toast.info(Messages.OTP_SENT_SUCCESS);
      setShowOtp(true);

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || "Verification failed";
      toast.error(errorMsg);
    } finally {
      setLoadingVerify(false);
    }
  };

  const handlUpdateEmail = async (otp: string): Promise<void> => {
    try {
      await AuthService.verifyUpdateEmail(otp, email); // verify otp and update status from confirm to Initiated
      setShowOtp(false);
      setVerified(true);
      toast.success("Email verified. Logging out for security.");
      setTimeout(() => {
        dispatch(logout());
      }, 3000);


    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.OTP_VERIFICATION_FAILED;
      toast.error(errorMsg);
    }
  };

  const resendOtp = async (): Promise<void> => {
    try {
      await AuthService.resendOtpApi(email);
      toast.info(Messages.OTP_SENT_SUCCESS);

    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.OTP_RESENT_FAILED;
      toast.error(errorMsg);
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
      <div className="relative flex flex-col md:flex-row items-center md:items-start gap-8 p-5 rounded-2xl shadow-md border border-gray-200 bg-white dark:bg-gray-900">

        {/* Left: Avatar & Name */}
        <div className="flex flex-col items-center text-center  md:w-1/3 border-b md:border-b-0 md:border-r border-gray-200 pb-6 md:pb-0">
          {user?.fname ? (
            <div className="flex items-center justify-center w-28 h-28 md:w-32 md:h-32 border-2 border-primary rounded-full shadow-xl bg-primary-foreground mt-5">
              <span className="text-5xl md:text-6xl font-bold text-primary">
                {user.fname[0]?.toUpperCase()}
              </span>
            </div>
          ) : (
            <HiUserCircle size={130} className="text-gray-400 " />
          )}

          {editEmail ? (
            <div className="text-xl font-semibold mt-4 space-y-2 pr-5 w-full ">
              <Label htmlFor="email" className="mb-2 ml-1 sr-only">E-mail</Label>
              <div className="relative gap-1">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled={verified}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter new mail"
                  className="dark:text-white text-center font-normal font-roboto "
                  maxLength={shortInputLength}
                />
                {verified && <p className="absolute rounded-md top-0 p-0.5 right-0 h-full">✔️</p>}
              </div>
              <div className="flex justify-between gap-3">

                <Button
                  type="button"
                  disabled={verified || loadingVerify}
                  className={"active:scale-95 cursor-pointer"}
                  onClick={handleVerifyEmail}
                >
                  {loadingVerify ? "loading..." : "Verify"}
                </Button>

                <Button
                  type="button"
                  onClick={() => {
                    setEditEmail(false);
                    setEmail(user?.email || "");
                  }}
                  className="cursor-pointer"
                >
                  Close
                </Button>
              </div>
              <p className="text-[10px] text-chart-3 font-serif font-light">*After updating the email you would need  re-login</p>
            </div>
          ) : (
            <div className="text-xl font-semibold mt-6 flex items-center gap-2 w-full justify-center">
              <p className="text-primary font-medium font-serif ml-5 text-sm ">{user?.email}</p>
              <CiEdit
                size={20}
                className="cursor-pointer text-gray-500 hover:text-primary transition-colors"
                onClick={() => setEditEmail(true)}
              />
            </div>
          )}

        </div>

        {/* Right: Info Fields */}
        <div className="flex-1 w-full md:w-2/3 relative">
          {/* Top row: Edit icon on the right */}
          <div className="flex justify-end absolute right-0 top-0">
            {user?.role !== RoleEnum.PROVIDER && toggle && (
              <CiEdit
                size={22}
                className="cursor-pointer text-gray-500 hover:text-primary transition-colors"
                onClick={() => toggle(true)}
              />
            )}
          </div>

          {/* Info fields */}
          <div className="space-y-6 mt-2">
            {/* Name */}
            <div className="flex flex-col">
              <p className="font-medium text-gray-700 dark:text-gray-200">Name</p>
              <p className="ml-4 text-gray-600 dark:text-gray-400">
                {`${toPascalCase(user?.fname ?? "")} ${user?.lname ?? ""}`}
              </p>
            </div>

            {/* Mobile */}
            <div className="flex flex-col">
              <p className="font-medium text-gray-700 dark:text-gray-200">Mobile</p>
              <p className="ml-4 text-gray-600 dark:text-gray-400">
                {user?.mobileNo || "N/A"}
              </p>
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <p className="font-medium text-gray-700 dark:text-gray-200">Address</p>
              <p className="ml-4 text-gray-600 dark:text-gray-400">
                {user?.location ? getFormattedAddress(user.location) : "N/A"}
              </p>
            </div>
          </div>
        </div>

      </div>

      {
        showOtp && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <Otp otpTime={30} otpLength={6} otpSubmit={handlUpdateEmail} resendOtp={resendOtp} />
          </div>
        )
      }

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
    </div >
  );
};

export default Profile;
