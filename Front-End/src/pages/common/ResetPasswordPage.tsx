import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { BGImage_404 } from "../../utils/constant";
import Header from "../../components/common/layout/Header";
import ResetPassword from "../../components/common/auth/ResetPassword";
import AuthService from "../../services/AuthService";
import { toast } from "react-toastify";


const ResetPasswordPage: React.FC = () => {
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
            
            const res = await AuthService.resetPasswordApi(token, password, cPassword);
            if (res.status === 200 ) {
                toast.success(res.data.message || "Password reset successful!");
                setTimeout(() => {
                    navigate("/"); 
                });
            }
        } catch (error: any) {
            console.error("Reset Password Error:", error)
            const errorMsg = error?.response?.data?.message || "Password Reset failed" ;
            toast.error(errorMsg);
            setTimeout(() => {
                navigate('/')
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header className="md:text-start" />
            <div className="flex justify-center items-center min-h-screen " style={{ backgroundImage: BGImage_404 }}>
                <ResetPassword passwordResetbutton={handleSubmit} loading={loading}  />
            </div>
        </>
    );
};

export default ResetPasswordPage;