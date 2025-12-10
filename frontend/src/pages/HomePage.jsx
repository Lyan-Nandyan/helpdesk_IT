import { useAuth } from '../auth/AuthContext'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const HomePage = () => {
    const { authenticated, login, roles, initialized } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        if (!initialized) return

        // Jika sudah login, redirect berdasarkan role
        if (authenticated && roles.length > 0) {
            if (roles.includes('admin')) {
                navigate('/admin', { replace: true })
            } else if (roles.includes('manager')) {
                navigate('/manager', { replace: true })
            } else if (roles.includes('user')) {
                navigate('/tickets', { replace: true })
            }
        }
    }, [authenticated, roles, initialized, navigate])

    if (!initialized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="text-center">
                    <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-600">Memuat...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center mb-12">
                    <div className="flex justify-center mb-6">
                        <svg
                            className="h-24 w-24 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-5xl font-bold text-gray-800 mb-4">
                        Helpdesk IT System
                    </h1>
                    <p className="text-xl text-gray-600 mb-8">
                        Sistem manajemen tiket untuk mendukung kebutuhan IT Anda
                    </p>

                    <button
                        onClick={login}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                        Login untuk Melanjutkan
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mt-16">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-blue-600 mb-4">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Kelola Tiket</h3>
                        <p className="text-gray-600">
                            Buat dan pantau tiket masalah IT dengan mudah
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-blue-600 mb-4">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Monitoring Real-time</h3>
                        <p className="text-gray-600">
                            Pantau status dan statistik tiket secara real-time
                        </p>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-blue-600 mb-4">
                            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold mb-2">Role-Based Access</h3>
                        <p className="text-gray-600">
                            Akses yang disesuaikan dengan peran pengguna
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HomePage
