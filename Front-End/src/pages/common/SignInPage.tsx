import { toast } from "react-toastify";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom"; 
import  { useGoogleLogin } from '@react-oauth/google'


import { BGImage_404, SingInThemeImage } from "@/utils/constant";
import Header from "@/components/common/layout/Header";
import SignIn from "@/components/common/auth/SignIn";
import AuthService from "@/services/AuthService";
import { validateEmail, validatePassword } from "@/utils/validation/formValidation";
import { Userinfo } from "@/store/userSlice";
import { useAppDispatch } from "@/store/hooks";
import { RoleEnum } from "@/shared/enums/roles";

const SignInPage: React.FC = () => {
  
  const [ loading, setLoading ] = useState(false); 
  const navigate = useNavigate()
  const { role } = useParams() 

  const dispatch = useAppDispatch()

  const isValidRole = Object.values(RoleEnum).includes(role as RoleEnum);
  const userRole: RoleEnum = isValidRole ? (role as RoleEnum) : RoleEnum.CUSTOMER;

  const handleLogin = async (email: string, password: string) => {

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      toast.error(emailError || passwordError);
      return;
    }
    
    const data = {
      email,
      password,
      role: userRole // this i need to do cz param return string and role is enum
    };

    setLoading(true);
    try {
      const res = await AuthService.signinApi(data) // 

      if (res.status === 200) {
        const { userData } = res.data;

        dispatch(Userinfo({ user: userData }));
        
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
      const errorMsg = error?.response?.data?.message ||"Login failed.. Please try again Later";
      toast.error(errorMsg);
    } finally {
      setLoading(false)
    }
  }

  const handleforgotPassword = async (email: string) => { 
    setLoading(true);
    try {
      const res = await AuthService.forgotPasswordApi(email)
      if (res.status === 200) {
        toast.success(res.data.message || "Verification mail has been  Created SuccessFully");
      }
    } catch (error : any) {
      const errorMsg = error?.response?.data?.message ||"Forgot Password Failed";
      toast.error(errorMsg);
    } finally {
      setLoading(false)
    }
  } 


  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (authResult:any) => {
      if (authResult.code) {
        const data = { code: authResult.code, role: userRole  };
        try {
          const res =await AuthService.googleSigninApi(data)

          if (res.status === 200) {
            const { userData } = res.data;
            dispatch(Userinfo({ user: userData }));
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
          console.log(error.response)
          const errorMsg = error?.response?.data?.message ||"Login failed.. Please try again Later";
          toast.error(errorMsg);
        }
      }
    },
    onError: (error) => {
      console.log("Google login error", error);
      toast.error("Google login failed");
    },
    flow: 'auth-code',  // this enables PKCE under the hood
  });


  return (
    <main className="min-h-screen flex flex-col" style={{ backgroundImage: BGImage_404 }} >
      <Header className={"md:text-end"} />
      <SignIn
        singInThemeImage={SingInThemeImage}
        signInSubmit={handleLogin}
        forgotPassword={handleforgotPassword}
        loading={loading}
        googleSignin={loginWithGoogle}
        role={role||RoleEnum.CUSTOMER} // Default to CUSTOMER if role is not provided
      />
    </main>
  );
};

export default SignInPage;

