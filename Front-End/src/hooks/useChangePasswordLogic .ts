import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { Messages } from "@/utils/constant";
import type { AxiosError } from "axios";
import { useAppSelector } from "@/store/hooks";
import { RoleEnum } from "@/shared/enums/Role";

export const useChangePasswordLogic = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromURL = searchParams.get("token");
    if (!tokenFromURL) {
      toast.error("Invalid or missing token");
      setTimeout(() => {
        navigate(-1);
      });
    } else {
      setToken(tokenFromURL);
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (password: string, cPassword: string): Promise<void> => {
    if (!token || !user) return;

    setLoading(true);
    try {
      const res = await AuthService.changePasswordApi(token, password, cPassword);
      if (res.status === HttpStatusCode.OK) {
        toast.success(res.data.message || Messages.PASSWORD_UPDATED_SUCCESS);
        setTimeout(() => {
          if (user.role === RoleEnum.CUSTOMER) {
            navigate(`/${user.role}/account/profile`);
          } else if (user.role === RoleEnum.PROVIDER) {
            navigate(`/${user.role}/settings/profile`);
          } else if (user.role === RoleEnum.ADMIN) {
            navigate(`/${user.role}/settings/profile`);
          }
        });
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Reset Password Error:", error);
      const errorMsg = error?.response?.data?.message || Messages.PASSWORD_UPDATE_FAILED;
      toast.error(errorMsg);
      setTimeout(() => {
        if (user.role === RoleEnum.CUSTOMER) {
          navigate(`/${user.role}/account/profile`);
        } else if (user.role === RoleEnum.PROVIDER) {
          navigate(`/${user.role}/settings/profile`);
        } else if (user.role === RoleEnum.ADMIN) {
          navigate(`/${user.role}/settings/profile`);
        }
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit,
  };
};
