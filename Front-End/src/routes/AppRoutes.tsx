import { createBrowserRouter } from 'react-router-dom'
import { RoleEnum } from '@/shared/enums/roles.ts'

import ErrorBoundary from '../pages/common/ErrorBoundary.tsx'
import PageNotFound from '../components/common/Others/PageNotFound'
import SignInPage from '../pages/common/SignInPage.tsx'
import SignUpPage from '../pages/common/SignUpPage.tsx'
import OtpPage from '../pages/common/OtpPage.tsx'
import ResetPasswordPage from '../pages/common/ResetPasswordPage.tsx'

import LandingPage from '../pages/client/LandingPage'
import ProfilePage from '../pages/client/ProfilePage.tsx'
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
import Testing from '@/pages/provider/Testing.tsx'
import SocketWrapper from '@/pages/common/SocketWrapper.tsx'


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
        path: '/user/services',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
                <ServicePage/>
            </ProtectedRoute>
        </ErrorBoundary >
    },
    {
        path: '/user/providers',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
                <ProvidersPage/>
            </ProtectedRoute>
        </ErrorBoundary >
    },
    {
        path: '/user/provider-KYC',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
                <VerifictionFormPage/>
            </ProtectedRoute>
        </ErrorBoundary>
    },
    {
        path: '/user/provider/booking/:providerId',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
                <ProviderBookingPage/>
            </ProtectedRoute>
        </ErrorBoundary >
    },
    {
        path: '/user/account/profile',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
                <ProfilePage />
            </ProtectedRoute>
        </ErrorBoundary >
    },
    {
        path: '/user/account/change-password',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.CUSTOMER]}>
                <ChangePasswordPage />
            </ProtectedRoute>
        </ErrorBoundary>
    },
    //Provider Routes
    {
        path: '/provider/dashboard',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.PROVIDER]}>
                <SocketWrapper>
                    <ProviderDashboardPage />
                </SocketWrapper>    
            </ProtectedRoute>
        </ErrorBoundary>
    },
    {
        path: '/provider/test',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.PROVIDER]}>
                <SocketWrapper>
                    <Testing />
                </SocketWrapper> 
            </ProtectedRoute>
        </ErrorBoundary>
    },

    // Admin Routes
    {
        path: '/admin/dashboard',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}>
                <AdminDashboardPage />
            </ProtectedRoute>
            </ErrorBoundary >
    },
    {
        path: '/admin/users',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}>
                <UserManagement />
            </ProtectedRoute>
        </ErrorBoundary>
    },
    {
        path: '/admin/providers',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}>
                <ProviderManagement />
            </ProtectedRoute>
        </ErrorBoundary>
    },
    {
        path: '/admin/provider-request',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}>
                <ProviderApplicationPage/>
            </ProtectedRoute>
        </ErrorBoundary>
    },
    {
        path: '/admin/services',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}>
                <ServiceManagement />
            </ProtectedRoute>
        </ErrorBoundary>
    },
    {
        path: '*',
        element: <PageNotFound />
    }
])
export default router

