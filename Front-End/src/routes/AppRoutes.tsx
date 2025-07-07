import { createBrowserRouter } from 'react-router-dom'
import ErrorBoundary from '../pages/common/ErrorBoundary.tsx'
import PageNotFound from '../components/common/Others/PageNotFound'
import SignInPage from '../pages/common/SignInPage.tsx'
import SignUpPage from '../pages/common/SignUpPage.tsx'
import OtpPage from '../pages/common/OtpPage.tsx'
import ResetPasswordPage from '../pages/common/ResetPasswordPage.tsx'

import LandingPage from '../pages/client/LandingPage'
import ProfilePage from '../pages/client/ProfilePage.tsx'
import ChangePasswordPage from '@/pages/client/ChangePassword.tsx'

import Dashboard from '../pages/admin/Dashboard'
import UserManagement from '../pages/admin/UserManagement'
import ProviderManagement from '../pages/admin/ProviderManagement'
import ServiceManagement from '../pages/admin/ServiceManagement'
import ProtectedRoute from './ProtectedRoutes.tsx'
import { RoleEnum } from '@/shared/enums/roles.ts'



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
    // Admin Routes
    {
        path: '/admin/dashboard',
        element: <ErrorBoundary>
            <ProtectedRoute allowedRoles={[RoleEnum.ADMIN]}>
                <Dashboard />
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

