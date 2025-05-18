import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../pages/client/LandingPage'
import PageNotFound from '../pages/PageNotFound'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import OtpVerification from '../pages/OtpVerification'
import ResetPassword from '../pages/ResetPassword'
import ErrorBoundary from '../utils/ErrorBoundary'
import Dashboard from '../pages/admin/Dashboard'

const router = createBrowserRouter([
    {
        path: '/',
        element: <LandingPage />
    },
    {
        path: '/signIn',
        element: <SignIn />
    },
    {
        path: '/signUp',
        element: <SignUp />
    },
    {
        path: '/otp',
        element: <ErrorBoundary><OtpVerification /></ErrorBoundary>
    },
    {
        path: '/resetPassword',
        element: <ErrorBoundary><ResetPassword /></ErrorBoundary>
    },
    // Admin
    {
        path: '/dashboard',
        element : <ErrorBoundary><Dashboard/></ErrorBoundary>
    },
    {
        path: '*',
        element: <PageNotFound />
    }
])
export default router

