// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import Header from './components/header'
import DashboardPage from './pages/DashboardPage'
import TicketsPage from './pages/TicketsPage'
import AdminPage from './pages/AdminPage'
import ManagerPage from './pages/ManagerPage'

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/manager" element={<ManagerPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
