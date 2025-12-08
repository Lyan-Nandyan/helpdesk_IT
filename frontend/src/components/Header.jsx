import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
const Header = () => {
    const { authenticated, profile, roles, login, logout } = useAuth()

    return (
        <header className="app-header bg-blue-600 text-white p-4 flex justify-between items-center">
            <h1>Helpdesk IT System</h1>

            <nav style={{ marginBottom: '8px' }}>
                <Link to="/">Dashboard</Link> |{' '}
                <Link to="/tickets">Tiket Saya</Link> |{' '}
                <Link to="/manager">Manager</Link> |{' '}
                <Link to="/admin">Admin</Link>
            </nav>

            <div className="auth-info">
                {authenticated ? (
                    <>
                        <span style={{ marginRight: '8px' }}>
                            Login sebagai: <strong>{profile?.username || profile?.email}</strong>{' '}
                            ({roles.join(', ') || 'tanpa role'})
                        </span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <span style={{ marginRight: '8px' }}>Anda belum login.</span>
                        <button onClick={login}>Login dengan Keycloak</button>
                    </>
                )}
            </div>
        </header>
    )
}
export default Header