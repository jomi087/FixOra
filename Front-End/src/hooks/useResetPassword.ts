import AuthService from "@/services/AuthService";
import { useState } from "react";
import { toast } from "react-toastify";

export const useResetPassword = () => {

    const [loading, setLoading] = useState(false);

    const handleResetPassword = async (email: string) => { 
        setLoading(true);
        try {
            const res = await AuthService.forgotPasswordApi(email)
        if (res.status === 200) {
            toast.success(res.data.message || "Verification mail has been  Created SuccessFully");
        }
        } catch (error : any) {
            const errorMsg = error?.response?.data?.message ||"Reset Password Failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false)
        }
    }

    return {
        loading,
        handleResetPassword
    }
}

