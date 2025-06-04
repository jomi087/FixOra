import { useState } from "react";
import { BGImage_404, signupApi } from "../../utils/constant";
import Header from "../../components/common/layout/Header";
import SignUp from "../../components/common/auth/SignUp";
import type { user } from "../../Types/user";
import { toast } from "react-toastify";
import axios from "axios";
import { validateCPassword, validateEmail, validateFName, validateLName, validateMobileNo, validatePassword } from "../../utils/formValidation";
import { useNavigate } from "react-router-dom";


const SignUpPage : React.FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (formData: user): Promise<void> => {
    
    const fnameError = validateFName(formData.fname);
    const lnameError = validateLName(formData.lname);
    const emailError = validateEmail(formData.email);
    const mobileNumberError = validateMobileNo(formData.mobileNo);
    const passwordError = validatePassword(formData.password);
    const CpasswordError = validateCPassword(formData.cPassword,formData.password)

    if (fnameError) {
      toast.error(fnameError);
      return;
    }

    if (lnameError) {
      toast.error(lnameError);
      return;
    }

    if (emailError) {
      toast.error(emailError);
      return;
    }

    if (mobileNumberError) {
      toast.error(mobileNumberError);
      return;
    } 

    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    if (CpasswordError) {
      toast.error(CpasswordError);
      return;
    }
    setLoading(true)
    try {
      const res = await axios.post(signupApi, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (res.status == 200) {
        toast.success(res.data.message || "Sign-in successful!");
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

  return (
    <main className="min-h-screen flex flex-col bg-cover " style={{ backgroundImage: BGImage_404 }} >
      <Header className={"md:text-start"} />
      <SignUp signUpSubmit={handleSubmit} loading={loading} />
    </main>
  );
};

export default SignUpPage;



