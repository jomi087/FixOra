import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";
import { RoleEnum } from "@/shared/enums/Role";

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const location = useLocation();


  if (isAuthenticated) {
    const from = location.state?.from;
    if (from) {
      return <Navigate to={from} replace />;
    }

    if (user?.role == RoleEnum.CUSTOMER) {
      return <Navigate to="/" replace />;
    } else if (user?.role == RoleEnum.PROVIDER) {
      return <Navigate to="/provider/dashboard" replace />;
    } else if (user?.role == RoleEnum.ADMIN) {
      return <Navigate to="/admin/dashboard" replace />;
    }
  }
  return <>{children}</>;
};

export default PublicRoute;
