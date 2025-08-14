import { createBrowserRouter } from 'react-router-dom'
import { RoleEnum } from '@/shared/enums/roles.ts'

import ErrorBoundary from '../pages/common/ErrorBoundary.tsx'
import PageNotFound from '../components/common/Others/PageNotFound'
import SignInPage from '../pages/common/SignInPage.tsx'
import SignUpPage from '../pages/common/SignUpPage.tsx'
import OtpPage from '../pages/common/OtpPage.tsx'
import ResetPasswordPage from '../pages/common/ResetPasswordPage.tsx'

import LandingPage from '../pages/client/LandingPage'
import ClientProfilePage  from '../pages/client/ProfilePage.tsx'
import ChangePasswordPage from '@/pages/client/ChangePassword.tsx'

import ProviderDashboardPage  from '@/pages/provider/DashboardPage.tsx'
import AdminDashboardPage from '../pages/admin/DashboardPage.tsx'
import UserManagement from '../pages/admin/UserManagement'
import ProviderManagement from '../pages/admin/ProviderManagement'
import ServiceManagement from '../pages/admin/ServiceManagement'
import ProtectedRoute from './ProtectedRoutes.tsx'
import ServicePage from '@/pages/client/ServicePage.tsx'
import ProvidersPage from '@/pages/client/ProvidersPage.tsx'
import VerifictionFormPage from '@/pages/client/VerifictionPage.tsx'
import ProviderApplicationPage from '@/pages/admin/ProviderApplicationPage.tsx'
import ProviderBookingPage from '@/pages/client/ProviderBookingPage.tsx'
import ProviderProfilePage  from '@/pages/provider/ProfilePage.tsx'
import SocketWrapper from '@/pages/common/SocketWrapper.tsx'
import ProviderLayout from '@/components/common/layout/ProviderLayout.tsx'
import UserLayout from '@/components/common/layout/UserLayout.tsx'
import AdminLayout from '@/components/common/layout/AdminLayout.tsx'


const router = createBrowserRouter([
    {
        path: '/',
        element: <ErrorBoundary><LandingPage /></ErrorBoundary>
    },
    {
        path: '/signIn/:role',
        element: <ErrorBoundary>
            <SignInPage />
        </ErrorBoundary>
    },
    {
        path: '/signUp',
        element: <ErrorBoundary><SignUpPage /></ErrorBoundary>
    },
    {
        path: '/otp',
        element: <ErrorBoundary><OtpPage/></ErrorBoundary>
    },
    {
        path: '/reset-Password',
        element: <ErrorBoundary><ResetPasswordPage /></ErrorBoundary>
    },
    //client Routes
    {
        path: '/user',
        element: (
            <ErrorBoundary>
                <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
                    <SocketWrapper>
                        <UserLayout />
                    </SocketWrapper>    
                </ProtectedRoute>
            </ErrorBoundary>
        ),
        children: [
            { path: 'services', element:  <ServicePage/> },
            { path: 'providers', element: <ProvidersPage /> },
            { path: 'provider-KYC', element:  <VerifictionFormPage/> },
            { path: 'provider/booking/:providerId', element:  <ProviderBookingPage/> },
            { path: 'account/profile', element:  <ClientProfilePage/> },
            { path: 'account/change-password', element:  <ChangePasswordPage/> },
        ],
    },
    //Provider Routes
    {
        path: '/provider',
        element: (
            <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.PROVIDER]}>
                <SocketWrapper>
                    <ProviderLayout />
                </SocketWrapper>
            </ProtectedRoute>
            </ErrorBoundary>
        ),
        children: [
            { path: 'dashboard', element: <ProviderDashboardPage /> },
            { path: 'profile', element: <ProviderProfilePage/> },
        ],
    },
    // Admin Routes
    {
        path: '/admin',
        element : (
             <ErrorBoundary>
                <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}>
                    <AdminLayout />
                </ProtectedRoute>
            </ErrorBoundary >
        ),
        children: [
            { path: 'dashboard', element: <AdminDashboardPage /> },
            { path: 'users', element: <UserManagement /> },
            { path: 'providers', element: <ProviderManagement /> },
            { path: 'provider-request', element: <ProviderApplicationPage /> },
            { path: 'services', element: <ServiceManagement /> },

        ]
    },
    {
        path: '*',
        element: <PageNotFound />
    }
])
export default router

