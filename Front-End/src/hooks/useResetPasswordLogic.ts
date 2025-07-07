import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import AuthService from "@/services/AuthService";

export const useResetPasswordLogic = () => {
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
      }); // no added delay
    } else {
      setToken(tokenFromURL);
    }
  }, [searchParams, navigate]);

  const handleSubmit = async (password: string, cPassword: string): Promise<void> => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await AuthService.resetPasswordApi(token, password, cPassword);
      if (res.status === 200) {
        toast.success(res.data.message || "Password reset successful!");
        setTimeout(() => {
          navigate("/");
        }); // no delay added
      }
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      const errorMsg = error?.response?.data?.message || "Password Reset failed";
      toast.error(errorMsg);
      setTimeout(() => {
        navigate("/");
      }); // exact to your version
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSubmit,
  };
};
