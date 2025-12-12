import { useAuth } from '../auth/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

const Header = () => {
  const { authenticated, profile, roles, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const getNavigationItems = () => {
    const items = []
    
    if (roles.includes('user') || roles.includes('admin') || roles.includes('manager')) {
      items.push({ path: '/tickets', label: 'Tiket Saya' })
    }
    
    if (roles.includes('admin')) {
      items.push({ path: '/admin', label: 'Admin' })
    }
    
    if (roles.includes('manager')) {
      items.push({ path: '/manager', label: 'Dashboard' })
    }
    
    return items
  }

  const navItems = getNavigationItems()

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - App Name and Navigation */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <svg
                className="h-8 w-8 text-white"
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
              <h1 className="text-2xl font-bold text-white">
                Helpdesk IT
              </h1>
            </button>

            {/* Navigation Menu */}
            {authenticated && navItems.length > 0 && (
              <nav className="hidden md:flex items-center gap-4">
                {navItems.map((item) => (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      location.pathname === item.path
                        ? 'bg-white text-blue-600'
                        : 'text-white hover:bg-blue-500'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </nav>
            )}
          </div>

          {/* Right side - Auth Info */}
          <div className="flex items-center gap-4">
            {authenticated && (
              <>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-white text-2xl font-bold">
                    {profile?.username || profile?.email}
                  </span>
                  <span className="text-white text-sm">
                    {profile?.firstName+" " + (profile?.lastName || '') || 'Pengguna'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header