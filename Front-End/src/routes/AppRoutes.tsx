import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../pages/client/LandingPage'
import PageNotFound from '../components/common/PageNotFound'
import SignIn from '../pages/SignIn'

const router = createBrowserRouter([
    {
        path: '/',
        element : <LandingPage/>
    },
    {
        path: '/signIn',
        element : <SignIn/>
    },
    {
        path: '*',
        element : <PageNotFound/>
    }
])
export default router
