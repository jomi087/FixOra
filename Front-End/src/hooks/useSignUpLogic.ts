import type { Signup } from "@/shared/Types/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateCPassword, validateEmail, validateFName, validateLName, validateMobileNo, validatePassword } from "@/utils/validation/formValidation";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";


export const useSignUpLogic = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (formData: Signup): Promise<void> => {
        
        const fnameError = validateFName(formData.fname);
        const lnameError = validateLName(formData.lname);
        const emailError = validateEmail(formData.email);
        const mobileNumberError = validateMobileNo(formData.mobileNo);
        const passwordError = validatePassword(formData.password);
        const cPasswordError = validateCPassword(formData.cPassword,formData.password)

        const errors = [
            fnameError,
            lnameError,
            emailError,
            mobileNumberError,
            passwordError,
            cPasswordError,
        ].filter(Boolean);

        if (errors.length) {
            toast.error(errors[0] as string); // Show the first error only
            return;
        }

        
        setLoading(true)
        try {
            const res = await AuthService.signupApi(formData)

            if (res.status == 200 || res.status == 201) {
                toast.success(res.data.message ||" OTP has been sent to your mail ");
                setTimeout(() => {
                navigate('/otp');
                }, 1000);
            }
        } catch (error: any) {
            const errorMsg = error?.response?.data?.message ||"Account Creation failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false)
        }
    }
    return {loading, handleSubmit }
}

