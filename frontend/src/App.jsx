import { Routes, Route } from 'react-router-dom'
import Header from './components/header'
import DashboardPage from './pages/DashboardPage'
import TicketsPage from './pages/TicketsPage'
import AdminPage from './pages/AdminPage'
import ManagerPage from './pages/ManagerPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
 
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />

          {/* tiket boleh diakses semua user yang sudah login */}
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
        </Routes>
      </main>
    </div>
  )
}

export default App
