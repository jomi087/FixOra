import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '@/store/hooks'
import type { ReactNode } from 'react'
import PageNotFound from '@/components/common/Others/PageNotFound'
import type { RoleEnum } from '@/shared/enums/roles'

interface ProtectedRouteProps {
  children: ReactNode
  allowedRoles: RoleEnum[]
}

const ProtectedRoute = ({ children, allowedRoles } : ProtectedRouteProps) => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated || !user) { 
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (!allowedRoles.includes(user.role as RoleEnum)) {
    return <PageNotFound />
  }

  //   if (!allowedRoles.includes(user.role as RoleEnum)) {
  //   return <Navigate to="/unauthorized" replace />
  // }

  return <>{children}</>
}

export default ProtectedRoute
