// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const ProtectedRoute = ({ roles: allowedRoles, children }) => {
    const { initialized, authenticated, roles } = useAuth()

    // Jika belum initialized, tampilkan loading
    if (!initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Memeriksa akses...</p>
                </div>
            </div>
        )
    }

    // Jika belum login, redirect ke home (yang akan trigger login)
    if (!authenticated) {
        return <Navigate to="/" replace />
    }

    // Jika sudah login tapi tidak punya role yang sesuai
    if (
        allowedRoles &&
        allowedRoles.length > 0 &&
        !allowedRoles.some((role) => roles.includes(role))
    ) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-md p-8">
                    <svg
                        className="mx-auto h-16 w-16 text-red-500 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        Akses Ditolak
                    </h3>
                    <p className="text-gray-600 mb-6">
                        Anda tidak memiliki izin untuk mengakses halaman ini.
                    </p>
                    <div className="text-sm text-gray-500">
                        <p className="mb-1">Role yang diperlukan: <span className="font-semibold">{allowedRoles.join(', ')}</span></p>
                        <p>Role Anda: <span className="font-semibold">{roles.join(', ') || 'Tidak ada'}</span></p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                    >
                        Kembali ke Beranda
                    </button>
                </div>
            </div>
        )
    }

    return children
}

export default ProtectedRoute
