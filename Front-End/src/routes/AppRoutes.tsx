import { createBrowserRouter } from 'react-router-dom'
import LandingPage from '../pages/client/LandingPage'
import PageNotFound from '@/components/Common/PageNotFound'

const router = createBrowserRouter([
    {
        path: '/',
        element : <LandingPage/>
    },
    {
        path: '*',
        element : <PageNotFound/>
    }
])
export default router
