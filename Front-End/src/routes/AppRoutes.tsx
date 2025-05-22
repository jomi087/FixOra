import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../pages/client/LandingPage'
import PageNotFound from '../components/common/Others/PageNotFound'
import ClientSignInPage from '../pages/client/ClientSignInPage.tsx'
import SignUpPage from '../pages/common/SignUpPage.tsx'
import OtpPage from '../pages/common/OtpPage.tsx'
import ResetPasswordPage from '../pages/common/ResetPasswordPage.tsx'
import ErrorBoundary from '../pages/common/ErrorBoundary.tsx'
import Dashboard from '../pages/admin/Dashboard'
import UserManagement from '../pages/admin/UserManagement'
import ProviderManagement from '../pages/admin/ProviderManagement'
import ServiceManagement from '../pages/admin/ServiceManagement'

const router = createBrowserRouter([
    {
        path: '/',
        element: <ErrorBoundary><LandingPage /></ErrorBoundary>
    },
    {
        path: '/signIn',
        element: <ErrorBoundary><ClientSignInPage /></ErrorBoundary>
    },
    {
        path: '/signUp',
        element: <ErrorBoundary><SignUpPage /></ErrorBoundary>
    },
    {
        path: '/otp',
        element: <ErrorBoundary><OtpPage /></ErrorBoundary>
    },
    {
        path: '/resetPassword',
        element: <ErrorBoundary><ResetPasswordPage /></ErrorBoundary>
    },
    // Admin Routes
    {
        path: '/dashboard',
        element : <ErrorBoundary><Dashboard/></ErrorBoundary>
    },
    {
        path: '/users',
        element : <ErrorBoundary><UserManagement/></ErrorBoundary>
    },
    {
        path: '/providers',
        element : <ErrorBoundary><ProviderManagement/></ErrorBoundary>
    },
    {
        path: '/services',
        element : <ErrorBoundary><ServiceManagement/></ErrorBoundary>
    },

    {
        path: '*',
        element: <PageNotFound />
    }
])
export default router

