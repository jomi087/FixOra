import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import ResetPassword from "../../components/common/auth/ResetPassword";
import AuthService from "../../services/AuthService";
import { toast } from "react-toastify";
import Nav from "@/components/common/layout/Nav";


const ChangePasswordPage: React.FC = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    const token = searchParams.get("token");
    if (!token) {
        toast.error("Invalid or missing token");
        setTimeout(() => {
            navigate(-1)
        }); 
        return null;
    }

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (password:string, cPassword:string): Promise<void> => {
        setLoading(true);
        try {
            
            const res = await AuthService.changePasswordApi(token, password, cPassword);
            if (res.status === 200 ) {
                toast.success(res.data.message || "Password updated successful!");
                setTimeout(() => {
                    navigate("/user/account/profile"); 
                });
            }
        } catch (error: any) {
            console.error("Reset Password Error:", error)
            const errorMsg = error?.response?.data?.message || "Password updation failed" ;
            toast.error(errorMsg);
            setTimeout(() => {
                navigate('/user/account/profile')
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Nav className='bg-nav-background text-nav-text' />
            <div className="flex pt-16 min-h-screen text-nav-text bg-nav-background  justify-center items-center">
                    <ResetPassword passwordResetbutton={handleSubmit} loading={loading}  />
            </div>
        </>
    );
};

export default ChangePasswordPage;