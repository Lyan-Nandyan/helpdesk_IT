import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './auth/AuthContext'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import TicketsPage from './pages/TicketsPage'
import AdminPage from './pages/AdminPage'
import ManagerPage from './pages/ManagerPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const { initialized, authenticated } = useAuth()

  // Tampilkan loading jika belum initialized
  if (!initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat aplikasi...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container min-h-screen bg-gray-50">
      {authenticated && <Header />}

      <main className="app-main">
        <Routes>
          {/* Home page - redirect jika sudah login */}
          <Route path="/" element={<HomePage />} />

          {/* Protected routes */}
          <Route
            path="/tickets"
            element={
              <ProtectedRoute roles={['user', 'admin', 'manager']}>
                <TicketsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/manager"
            element={
              <ProtectedRoute roles={['manager']}>
                <ManagerPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin']}>
                <AdminPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all - redirect ke home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
