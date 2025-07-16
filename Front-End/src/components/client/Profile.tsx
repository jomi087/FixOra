import { HiUserCircle } from "react-icons/hi2";
import { CiEdit } from "react-icons/ci";
import { useAppSelector } from "@/store/hooks";
import { getFormattedAddress } from "@/utils/helper/formatedAddress";
import { useState } from "react";
import AuthService from "@/services/AuthService";
import { toast } from "react-toastify";
import ChangePassowrdDialog from "./ChangePassowrdDialog";
import { validatePassword } from "@/utils/validation/formValidation";

interface ProfileProps { 
    toggle: (editMode: boolean) => void;
}

const Profile: React.FC<ProfileProps> = ({ toggle }) => {

    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const { user } = useAppSelector((state) => state.auth);

    const handleChangePassword = async (password:string) => { 
        const error = validatePassword(password)
        if (error) {
            setErrorMsg(error)
            return
        }
        setErrorMsg("")
        setLoading(true)
        try {
            const res = await AuthService.verifyPasswordApi(password)
            if (res.status === 200) {
                toast.success(res.data.message || "A mail has been sent to your mail" )
            }
            setIsDialogOpen(false)
        } catch (error:any) {
            const errorMsg = error?.response?.data?.message ||"Password verification Failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex-1 px-6 pt-6 max-w-4xl mx-auto text-nav-text">
            <h2 className="text-3xl font-bold mb-8">My Profile</h2>

            <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-10 rounded-xl shadow-lg border border-gray-200 bg-white dark:bg-gray-900 cursor-context-menu">
                {/* Profile Image & Name */}
                <div className="flex flex-col items-center text-center md:w-1/2 md:border-r-2">
                    <HiUserCircle size={200} className="text-userIcon-text" />
                    <h3 className="text-xl font-semibold mt-4 flex items-center gap-2 ">
                        {`${user?.fname} ${user?.lname} `}
                        <CiEdit size={20}
                            className="cursor-pointer text-gray-500 hover:text-primary"
                            onClick={() => toggle(true)}
                        />
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
                        <p className="text-gray-600 dark:text-white ml-5">{`${user?.mobileNo}`}</p>
                    </div>

                    <div>
                        <span className="font-semibold">Address:</span>
                        <p className="text-gray-600 dark:text-white ml-5">{ `${user?.location ? getFormattedAddress(user.location) : "N/A"}`} </p>
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
