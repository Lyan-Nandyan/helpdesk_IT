import { Link } from 'react-router-dom';
const Header = () => {
    return (
    <header className="app-header bg-blue-600 text-white p-4 flex justify-between items-center">
        <h1>Helpdesk IT System</h1>
        <nav className="nav-links">
            <Link className='mr-4' to="/">Dashboard</Link>
            <Link className='mr-4' to="/tickets">Tiket Saya</Link>
            <Link className='mr-4' to="/manager">Manager</Link>
            <Link className='mr-4' to="/admin">Admin</Link>
        </nav>
        {/* Nanti di sini kita taruh info user + tombol Login/Logout */}
    </header>
    )
}
export default Header