import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../pages/client/LandingPage'
import PageNotFound from '../pages/PageNotFound'
import SignIn from '../pages/SignIn'
import SignUp from '../pages/SignUp'
import OtpVerification from '../pages/OtpVerification'
import ResetPassword from '../pages/ResetPassword'

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
        element: <OtpVerification />
    },
    {
        path: '/resetPassword',
        element: <ResetPassword />
    },
    {
        path: '*',
        element: <PageNotFound />
    }
])
export default router
