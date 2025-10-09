import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { Messages } from "@/utils/constant";
import type { AxiosError } from "axios";

export const useChangePasswordLogic = () => {
  const [searchParams] = useSearchParams();
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
    if (!token) return;

    setLoading(true);
    try {
      const res = await AuthService.changePasswordApi(token, password, cPassword);
      if (res.status === HttpStatusCode.OK) {
        toast.success(res.data.message || Messages.PASSWORD_UPDATED_SUCCESS);
        setTimeout(() => {
          navigate("/customer/account/profile");
        });
      }
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error("Reset Password Error:", error);
      const errorMsg = error?.response?.data?.message || Messages.PASSWORD_UPDATE_FAILED;
      toast.error(errorMsg);
      setTimeout(() => {
        navigate("/customer/account/profile");
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
