import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { RoleEnum } from "@/shared/enums/roles";
import { useAppDispatch } from "@/store/hooks";
import { Userinfo } from "@/store/common/userSlice";
import { Messages } from "@/utils/constant";
import { validateEmail, validatePassword } from "@/utils/validation/formValidation";
import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchNotifications } from "@/store/common/notificationSlice";
import type { AxiosError } from "axios";

export const useSignInLogic = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { role } = useParams();
  const dispatch = useAppDispatch();

  const isValidRole = Object.values(RoleEnum).includes(role as RoleEnum);
  const userRole: RoleEnum = isValidRole ? (role as RoleEnum) : RoleEnum.CUSTOMER;

  const navigateByRole = (userRole: RoleEnum) => {
    switch (userRole) {
    case RoleEnum.CUSTOMER:
      navigate("/");
      break;
    case RoleEnum.PROVIDER:
      navigate("/provider/dashboard");
      break;
    case RoleEnum.ADMIN:
      navigate("/admin/dashboard");
      break;
    }
  };

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
      const res = await AuthService.signinApi(data); // 

      if (res.status === HttpStatusCode.OK) {
        const { userData } = res.data;
        dispatch(Userinfo({ user: userData }));
        dispatch(fetchNotifications());
        toast.success(res.data.message || Messages.SIGNIN_SUCCESS);
        //navigateByRole(userData.role);
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      const errorMsg = error?.response?.data?.message || Messages.LOGIN_FAILED;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (email: string) => {
    setLoading(true);
    try {
      const res = await AuthService.forgotPasswordApi(email);
      if (res.status === HttpStatusCode.OK) {
        toast.success(res.data.message || Messages.MAIL_SENT_MSG);
      }
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const errorMsg = error?.response?.data?.message || Messages.FORGOT_PASSWORD_FAILED;
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (authResult: { code?: string }) => {
      if (authResult.code) {
        const data = { code: authResult.code, role: userRole };
        try {
          const res = await AuthService.googleSigninApi(data);

          if (res.status === HttpStatusCode.OK) {
            const { userData } = res.data;
            dispatch(Userinfo({ user: userData }));
            toast.success(res.data.message || Messages.SIGNIN_SUCCESS);

            navigateByRole(userData.role);
          }

        } catch (err) {
          const error = err as AxiosError<{ message: string }>;
          console.log(error.response);
          const errorMsg = error?.response?.data?.message || Messages.LOGIN_FAILED;
          toast.error(errorMsg);
        }
      }
    },
    onError: (error) => {
      console.log("Google login error", error);
      toast.error("Google login failed");
    },
    flow: "auth-code",  // this enables PKCE under the hood
  });

  return {
    handleLogin,
    handleForgotPassword,
    loginWithGoogle,
    loading,
    userRole,
  };

};

