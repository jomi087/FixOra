import { useEffect } from "react";
import { useAppDispatch } from "../../store/hooks";
import { logout, Userinfo } from "../../store/common/userSlice";
import AuthService from "../../services/AuthService";
import { HttpStatusCode } from "@/shared/enums/HttpStatusCode";
import { fetchNotifications } from "@/store/common/notificationSlice";

const AuthCheck = ({ onComplete }: { onComplete: () => void }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const response = await AuthService.checkAuthStatusApi();
        if (response.status === HttpStatusCode.OK) {
          dispatch(Userinfo({ user: response.data.user }));
          dispatch(fetchNotifications());
        }
      } catch{
        dispatch(logout());
        //console.log("error",error);
      } finally {
        onComplete();
      }
    };
    verifyAuth();
  }, [dispatch]);

  return null;
};

export default AuthCheck;

