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

const SignUpPage = lazy(() => import("@/pages/common/SignUpPage"));
const OtpPage = lazy(() => import("@/pages/common/OtpPage"));
const ResetPasswordPage = lazy(() => import("@/pages/common/ResetPasswordPage"));
const ClientProfilePage = lazy(() => import("@/pages/client/ProfilePage"));
const ChangePasswordPage = lazy(() => import("@/pages/common/ChangePasswordPage"));

const PaymentPage = lazy(() => import("@/pages/common/PaymentPage"));
const UserLayout = lazy(() => import("@/components/common/layout/UserLayout"));
import ServicePage from "@/pages/client/ServicePage.tsx";
import ProvidersPage from "@/pages/client/ProvidersPage.tsx";
import VerifictionFormPage from "@/pages/client/VerifictionPage.tsx";
import ProviderBookingPage from "@/pages/client/ProviderBookingPage.tsx";
import BookingHistoryPage from "@/pages/client/BookingHistoryPage.tsx";
import BookingDetailsPage from "@/pages/client/BookingDetailsPage.tsx";
import ClientWalletPage from "@/pages/client/WalletPage.tsx";
const ClientChatPage = lazy(() => import("@/pages/client/ChatPage"));

const ProviderLayout = lazy(() => import("@/components/common/layout/ProviderLayout"));
import ProviderDashboardPage from "@/pages/provider/DashboardPage.tsx";
const ProviderChatPage = lazy(() => import("@/pages/provider/ChatPage"));
import JobDetailsPage from "@/pages/provider/JobDetailsPage.tsx";
import ProviderWalletPage from "@/pages/provider/WalletPage.tsx";
import JobHistoryPage from "@/pages/provider/JobHistoryPage.tsx";
const ProviderProfilePage = lazy(() => import("@/pages/provider/ProfilePage"));
const AdvanceProfilePage = lazy(() => import("@/pages/provider/AdvanceProfilePage"));
const AvailabilityPage = lazy(() => import("@/pages/provider/AvailabilityPage"));
const SalesPage = lazy(() => import("@/pages/provider/SalesPage"));

const AdminLayout = lazy(() => import("@/components/common/layout/AdminLayout"));
import AdminDashboardPage from "../pages/admin/DashboardPage.tsx";
import UserManagement from "../pages/admin/UserManagement";
import ProviderManagement from "../pages/admin/ProviderManagement";
import ProviderApplicationPage from "@/pages/admin/ProviderApplicationPage.tsx";
import ServiceManagement from "../pages/admin/ServiceManagement";
import DisputePage from "@/pages/admin/DisputePage.tsx";
import DisputeInfoPage from "@/pages/admin/DisputeInfoPage.tsx";
import SettingsPage from "@/pages/admin/SettingsPage.tsx";
const AdminProfilePage = lazy(() => import("@/pages/admin/ProfilePage"));
const CommissionFeePage = lazy(() => import("@/pages/admin/CommissionFeePage"));

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

