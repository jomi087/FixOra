import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 

import { BGImage_404,SingInThemeImage } from "../../utils/constant";
import Header from "../../components/common/layout/Header";
import SignIn from "../../components/common/auth/SignIn";
import { RoleEnum } from "../../../shared/enums/roles"; 
import AuthSerivice from "../../services/AuthSerivice";
import { validateEmail, validatePassword } from "../../utils/formValidation";
import { useDispatch } from "react-redux";
import { Userinfo } from "../../store/userSlice";

const SignInPage: React.FC = () => {
  
  const [ loading, setLoading ] = useState(false); 
  const navigate = useNavigate()
  const { role } = useParams() 

  const dispatch = useDispatch()


  const handleLogin = async (email: string, password: string) => {

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }

    const isValidRole = Object.values(RoleEnum).includes(role as RoleEnum);
    const userRole: RoleEnum = isValidRole ? (role as RoleEnum) : RoleEnum.CUSTOMER;
    
    const data = {
      email,
      password,
      role: userRole // this i need to do cz param return string and role is enum
    };

    setLoading(true);
    try {

      console.log("formData", data)
      const res = await AuthSerivice.signin(data)

      if (res.status === 200) {
        console.log("Login successful", res.data);
        const { userData, token } = res.data;

        dispatch(Userinfo({ user: userData, token }));
        
        toast.success(res.data.message || "Sign-in successful!");
        if (userData.role === RoleEnum.CUSTOMER) {
          navigate("/"); 
        } else if (userData.role === RoleEnum.PROVIDER) {
          navigate("/provider/dashboard");
        } else if (userData.role === RoleEnum.ADMIN) {
          navigate("/admin/dashboard");
        }
      }

    } catch (error: any) {
      
      const errorMsg = error?.response?.data?.message ||"Login failed. Please try again Later";
      toast.error(errorMsg);
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyEmail = async (email: string) => { 
    
    setLoading(true);
    try {
      console.log("VERIFIYING  EMAL BY ", email);
      // will add later
      //validate
      //on success,  navigate to otp page 
    } catch ( err: unknown ) {
      toast.error("email verification failed");
    } finally {
      setLoading(false)
    }
  } 
    
  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundImage: BGImage_404 }} >
      <Header className={"md:text-end"} />
      <SignIn
        singInThemeImage={SingInThemeImage}
        signInSubmit={handleLogin}
        verifyEmail={handleVerifyEmail}
        loading={loading}
        role={role||RoleEnum.CUSTOMER} // Default to CUSTOMER if role is not provided
      />
    </main>
  );
};

export default SignInPage;

