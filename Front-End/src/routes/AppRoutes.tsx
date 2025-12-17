import { createBrowserRouter } from "react-router-dom";
import { RoleEnum } from "@/shared/enums/roles.ts";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoutes.tsx";
import PublicRoute from "./PublicRoute.tsx";

import PageLoader from "@/components/common/others/PageLoader.tsx";
import ErrorBoundary from "../pages/common/ErrorBoundary.tsx";
import PageNotFound from "../components/common/others/PageNotFound.tsx";
import SignInPage from "../pages/common/SignInPage.tsx";
import LandingPage from "../pages/client/LandingPage";

// import SignUpPage from "../pages/common/SignUpPage.tsx";
const SignUpPage = lazy(() => import("@/pages/common/SignUpPage"));

// import OtpPage from "../pages/common/OtpPage.tsx";
const OtpPage = lazy(() => import("@/pages/common/OtpPage"));

// import ResetPasswordPage from "../pages/common/ResetPasswordPage.tsx";
const ResetPasswordPage = lazy(() => import("@/pages/common/ResetPasswordPage"));

// import ClientProfilePage from "../pages/client/ProfilePage.tsx";
const ClientProfilePage = lazy(() => import("@/pages/client/ProfilePage"));

// import ChangePasswordPage from "@/pages/common/ChangePasswordPage.tsx";
const ChangePasswordPage = lazy(() => import("@/pages/common/ChangePasswordPage"));

// import ProviderLayout from "@/components/common/layout/ProviderLayout.tsx";
// import UserLayout from "@/components/common/layout/UserLayout.tsx";
// import AdminLayout from "@/components/common/layout/AdminLayout.tsx";
const UserLayout = lazy(() => import("@/components/common/layout/UserLayout"));
const ProviderLayout = lazy(() => import("@/components/common/layout/ProviderLayout"));
const AdminLayout = lazy(() => import("@/components/common/layout/AdminLayout"));

import ProviderDashboardPage from "@/pages/provider/DashboardPage.tsx";
import AdminDashboardPage from "../pages/admin/DashboardPage.tsx";
import UserManagement from "../pages/admin/UserManagement";
import ProviderManagement from "../pages/admin/ProviderManagement";
import ServiceManagement from "../pages/admin/ServiceManagement";
import ServicePage from "@/pages/client/ServicePage.tsx";
import ProvidersPage from "@/pages/client/ProvidersPage.tsx";
import VerifictionFormPage from "@/pages/client/VerifictionPage.tsx";
import ProviderApplicationPage from "@/pages/admin/ProviderApplicationPage.tsx";
import ProviderBookingPage from "@/pages/client/ProviderBookingPage.tsx";
import ProviderProfilePage from "@/pages/provider/ProfilePage.tsx";


// import PaymentPage from "@/pages/common/PaymentPage.tsx";
const PaymentPage = lazy(() => import("@/pages/common/PaymentPage"));

import BookingHistoryPage from "@/pages/client/BookingHistoryPage.tsx";
import BookingDetailsPage from "@/pages/client/BookingDetailsPage.tsx";
import JobHistoryPage from "@/pages/provider/JobHistoryPage.tsx";
import JobDetailsPage from "@/pages/provider/JobDetailsPage.tsx";
import ProviderWalletPage from "@/pages/provider/WalletPage.tsx";
import ClientWalletPage from "@/pages/client/WalletPage.tsx";

// import AvailabilityPage from "@/pages/provider/AvailabilityPage.tsx";
const AvailabilityPage = lazy(() => import("@/pages/provider/AvailabilityPage"));

// import AdvanceProfilePage from "@/pages/provider/AdvanceProfilePage.tsx";
const AdvanceProfilePage = lazy(() => import("@/pages/provider/AdvanceProfilePage"));

import SettingsPage from "@/pages/admin/SettingsPage.tsx";
import AdminProfilePage from "../pages/admin/ProfilePage.tsx";

// import CommissionFeePage from "@/pages/admin/CommissionFeePage.tsx";
const CommissionFeePage = lazy(() => import("@/pages/admin/CommissionFeePage"));

import SalesPage from "@/pages/provider/SalesPage.tsx";
import DisputePage from "@/pages/admin/DisputePage.tsx";
import DisputeInfoPage from "@/pages/admin/DisputeInfoPage.tsx";

// import ProviderChatPage from "@/pages/provider/ChatPage.tsx";
const ProviderChatPage = lazy(() => import("@/pages/provider/ChatPage"));

// import ClientChatPage from "@/pages/client/ChatPage.tsx";
const ClientChatPage = lazy(() => import("@/pages/client/ChatPage"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <ErrorBoundary><LandingPage /></ErrorBoundary>
  },
  {
    path: "/signIn/:role",
    element: (
      <ErrorBoundary>
        <PublicRoute>
          <SignInPage />
        </PublicRoute>
      </ErrorBoundary>
    )
  },
  {
    path: "/signUp",
    element: (
      <ErrorBoundary>
        <PublicRoute>
          <Suspense fallback={<PageLoader />}>
            <SignUpPage />
          </Suspense>
        </PublicRoute>
      </ErrorBoundary>
    )
  },
  {
    path: "/otp",
    element: (
      <ErrorBoundary>
        <PublicRoute>
          <Suspense fallback={<PageLoader />}>
            <OtpPage />
          </Suspense>
        </PublicRoute>
      </ErrorBoundary>
    )
  },
  {
    path: "/reset-Password",
    element: (
      <ErrorBoundary>
        <PublicRoute>
          <Suspense fallback={<PageLoader />}>
            <ResetPasswordPage />
          </Suspense>
        </PublicRoute>
      </ErrorBoundary>
    )
  },
  //client Routes
  {
    path: `/${RoleEnum.CUSTOMER}`,
    element: (
      <ErrorBoundary>
        <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
          <Suspense fallback={<PageLoader />}>
            <UserLayout />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    children: [
      { path: "services", element: <ServicePage /> },
      { path: "providers", element: <ProvidersPage /> },
      { path: "provider-KYC", element: <VerifictionFormPage /> },
      { path: "providers/provider-booking/:providerId", element: <ProviderBookingPage /> },
      { path: "providers/provider-booking/payment/:bookingId", element: <Suspense fallback={<PageLoader />}><PaymentPage /></Suspense> },
      { path: "account/profile", element: <Suspense fallback={<PageLoader />}><ClientProfilePage /></Suspense> },
      { path: "change-password", element: <Suspense fallback={<PageLoader />}><ChangePasswordPage /></Suspense> },
      { path: "account/bookings", element: <BookingHistoryPage /> },
      { path: "booking-details/:bookingId", element: <BookingDetailsPage /> },
      { path: "account/chats", element: <Suspense fallback={<PageLoader />}><ClientChatPage /></Suspense> },
      { path: "account/wallet", element: <ClientWalletPage /> },
    ],
  },
  //Provider Routes
  {
    path: `/${RoleEnum.PROVIDER}`,
    element: (
      <ErrorBoundary>
        <ProtectedRoute allowedRoles={[RoleEnum.PROVIDER]}>
          <Suspense fallback={<PageLoader />}>
            <ProviderLayout />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary>
    ),
    children: [
      { path: "dashboard", element: <ProviderDashboardPage /> },
      { path: "chats", element: <Suspense fallback={<PageLoader />}><ProviderChatPage /></Suspense> },
      { path: "wallet", element: <ProviderWalletPage /> },
      { path: "booking-history", element: <JobHistoryPage /> },
      { path: "booking-details/:bookingId", element: <JobDetailsPage /> },
      { path: "settings/profile", element: <ProviderProfilePage /> },
      { path: "change-password", element: <ChangePasswordPage /> },
      { path: "settings/advance-profile", element: <Suspense fallback={<PageLoader />}><AdvanceProfilePage /></Suspense> },
      { path: "settings/availability", element: <Suspense fallback={<PageLoader />}><AvailabilityPage /></Suspense> },
      { path: "settings/sales", element: <SalesPage /> },
    ],
  },
  // Admin Routes
  {
    path: "/admin",
    element: (
      <ErrorBoundary>
        <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}>
          <Suspense fallback={<PageLoader />}>
            <AdminLayout />
          </Suspense>
        </ProtectedRoute>
      </ErrorBoundary >
    ),
    children: [
      { path: "dashboard", element: <AdminDashboardPage /> },
      { path: "users", element: <UserManagement /> },
      { path: "providers", element: <ProviderManagement /> },
      { path: "provider-request", element: <ProviderApplicationPage /> },
      { path: "services", element: <ServiceManagement /> },
      { path: "disputes", element: <DisputePage /> },
      { path: "disputes/:disputeId", element: <DisputeInfoPage /> },
      { path: "settings", element: <SettingsPage /> },
      { path: "settings/profile", element: <AdminProfilePage /> },
      { path: "change-password", element: <ChangePasswordPage /> },
      { path: "settings/commission-fee", element: <Suspense fallback={<PageLoader />}><CommissionFeePage /></Suspense> },
    ]
  },
  {
    path: "*",
    element: <PageNotFound />
  }
]);
export default router;

