import { createBrowserRouter } from "react-router-dom";
import { RoleEnum } from "@/shared/enums/roles.ts";

import ErrorBoundary from "../pages/common/ErrorBoundary.tsx";
import PageNotFound from "../components/common/Others/PageNotFound";
import SignInPage from "../pages/common/SignInPage.tsx";
import SignUpPage from "../pages/common/SignUpPage.tsx";
import OtpPage from "../pages/common/OtpPage.tsx";
import ResetPasswordPage from "../pages/common/ResetPasswordPage.tsx";

import LandingPage from "../pages/client/LandingPage";
import ClientProfilePage from "../pages/client/ProfilePage.tsx";
import ChangePasswordPage from "@/pages/client/ChangePassword.tsx";

import ProviderDashboardPage from "@/pages/provider/DashboardPage.tsx";
import AdminDashboardPage from "../pages/admin/DashboardPage.tsx";
import UserManagement from "../pages/admin/UserManagement";
import ProviderManagement from "../pages/admin/ProviderManagement";
import ServiceManagement from "../pages/admin/ServiceManagement";
import ProtectedRoute from "./ProtectedRoutes.tsx";
import ServicePage from "@/pages/client/ServicePage.tsx";
import ProvidersPage from "@/pages/client/ProvidersPage.tsx";
import VerifictionFormPage from "@/pages/client/VerifictionPage.tsx";
import ProviderApplicationPage from "@/pages/admin/ProviderApplicationPage.tsx";
import ProviderBookingPage from "@/pages/client/ProviderBookingPage.tsx";
import ProviderProfilePage from "@/pages/provider/ProfilePage.tsx";
import ProviderLayout from "@/components/common/layout/ProviderLayout.tsx";
import UserLayout from "@/components/common/layout/UserLayout.tsx";
import AdminLayout from "@/components/common/layout/AdminLayout.tsx";
import PaymentPage from "@/pages/common/PaymentPage.tsx";
import BookingHistoryPage from "@/pages/client/BookingHistoryPage.tsx";
import BookingDetailsPage from "@/pages/client/BookingDetailsPage.tsx";
import JobHistoryPage from "@/pages/provider/JobHistoryPage.tsx";
import JobDetailsPage from "@/pages/provider/JobDetailsPage.tsx";
import ProviderWalletPage from "@/pages/provider/WalletPage.tsx";
import UserWalletPage from "@/pages/client/WalletPage.tsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <ErrorBoundary><LandingPage /></ErrorBoundary>
  },
  {
    path: "/signIn/:role",
    element: <ErrorBoundary>
      <SignInPage />
    </ErrorBoundary>
  },
  {
    path: "/signUp",
    element: <ErrorBoundary><SignUpPage /></ErrorBoundary>
  },
  {
    path: "/otp",
    element: <ErrorBoundary><OtpPage /></ErrorBoundary>
  },
  {
    path: "/reset-Password",
    element: <ErrorBoundary><ResetPasswordPage /></ErrorBoundary>
  },
  //client Routes
  {
    path: "/user",
    element: (
      <ErrorBoundary>
        <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
          <UserLayout />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    children: [
      { path: "services", element: <ServicePage /> },
      { path: "providers", element: <ProvidersPage /> },
      { path: "providers/provider-booking/:providerId", element: <ProviderBookingPage /> },
      { path: "providers/provider-booking/payment/:bookingId", element: <PaymentPage /> },
      { path: "account/profile", element: <ClientProfilePage /> },
      { path: "account/profile/change-password", element: <ChangePasswordPage /> },
      { path: "account/bookings", element: <BookingHistoryPage /> },
      { path: "account/bookings/details/:bookingId", element: <BookingDetailsPage /> },
      { path: "account/wallet", element: <UserWalletPage /> },
      { path: "provider-KYC", element: <VerifictionFormPage /> },
    ],
  },
  //Provider Routes
  {
    path: "/provider", 
    element: (
      <ErrorBoundary>
        <ProtectedRoute allowedRoles={[RoleEnum.PROVIDER]}>
          <ProviderLayout />
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    children: [
      { path: "dashboard", element: <ProviderDashboardPage /> },
      { path: "booking-history", element: <JobHistoryPage /> },
      { path: "booking-history/details/:bookingId", element: <JobDetailsPage /> },
      { path: "wallet", element: <ProviderWalletPage /> },
      { path: "profile", element: <ProviderProfilePage /> },
    ],
  },
  // Admin Routes
  {
    path: "/admin",
    element: (
      <ErrorBoundary>
        <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}>
          <AdminLayout />
        </ProtectedRoute>
      </ErrorBoundary >
    ),
    children: [
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "users", element: <UserManagement /> },
      { path: "providers", element: <ProviderManagement /> },
      { path: "provider-request", element: <ProviderApplicationPage /> },
      { path: "services", element: <ServiceManagement /> },
    ]
  },
  {
    path: "*",
    element: <PageNotFound />
  }
]);
export default router;

