// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const ProtectedRoute = ({ roles: allowedRoles, children }) => {
    const { initialized, authenticated, roles } = useAuth()
    const location = useLocation()

    if (!initialized) {
        return <div>Memeriksa akses...</div>
    }

    if (!authenticated) {
        // kalau belum login → lempar ke halaman root
        return <Navigate to="/" replace state={{ from: location }} />
    }

    if (
        allowedRoles &&
        allowedRoles.length > 0 &&
        !allowedRoles.some((role) => roles.includes(role))
    ) {
        // sudah login tapi tidak punya role yang sesuai
        return <div>Anda tidak memiliki akses ke halaman ini.</div>
    }

    return children
}

export default ProtectedRoute
