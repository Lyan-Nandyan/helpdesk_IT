import { useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from '../auth/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE

const STATUS_OPTIONS = [
    { value: 'open', label: 'Open', color: 'bg-green-100 text-green-800 border-green-300' },
    { value: 'inprogress', label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'closed', label: 'Closed', color: 'bg-gray-100 text-gray-800 border-gray-300' },
]

const PRIORITY_OPTIONS = [
    { value: 'low', label: 'Rendah', color: 'bg-blue-100 text-blue-800 border-blue-300' },
    { value: 'medium', label: 'Sedang', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    { value: 'high', label: 'Tinggi', color: 'bg-red-100 text-red-800 border-red-300' },
]

// Components
const ErrorAlert = ({ message }) => (
    <div className="border border-red-400 bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
        <p className="font-medium">{message}</p>
    </div>
)

const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 flex items-center gap-3 shadow-xl">
            <div className="animate-spin h-6 w-6 border-3 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="text-gray-700 font-medium">Memproses...</span>
        </div>
    </div>
)

const SearchBar = ({ searchTerm, onSearch, resultCount, totalCount }) => (
    <div className="mb-6">
        <div className="relative">
            <input
                type="text"
                placeholder="Cari berdasarkan ID, judul, atau pembuat..."
                value={searchTerm}
                onChange={(e) => onSearch(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <svg
                className="absolute left-3 top-3.5 h-5 w-5 text-gray-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
            >
                <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
        </div>
        <p className="text-sm text-gray-600 mt-2">
            Menampilkan <span className="font-semibold">{resultCount}</span> dari <span className="font-semibold">{totalCount}</span> tiket
        </p>
    </div>
)

const StatusDropdown = ({ value, onChange, disabled }) => {
    const currentStatus = STATUS_OPTIONS.find(opt => opt.value === value)

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2 rounded-md border text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${currentStatus?.color} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
        >
            {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    )
}

const PriorityDropdown = ({ value, onChange, disabled }) => {
    const currentPriority = PRIORITY_OPTIONS.find(opt => opt.value === value)

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            className={`w-full px-3 py-2 rounded-md border text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${currentPriority?.color} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-80'}`}
        >
            {PRIORITY_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    )
}

const TicketTable = ({ tickets, onStatusChange, onPriorityChange, onDelete, loading }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '-'
        return new Date(dateString).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        })
    }

    if (tickets.length === 0) {
        return (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada tiket</h3>
                <p className="mt-1 text-sm text-gray-500">Belum ada tiket yang ditemukan.</p>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioritas</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dibuat Oleh</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {tickets.map((ticket) => (
                            <tr key={ticket.id_ticket} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    #{ticket.id_ticket}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                    <div className="max-w-xs truncate" title={ticket.title}>
                                        {ticket.title}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusDropdown
                                        value={ticket.status}
                                        onChange={(newStatus) => onStatusChange(ticket.id_ticket, newStatus)}
                                        disabled={loading}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <PriorityDropdown
                                        value={ticket.priority}
                                        onChange={(newPriority) => onPriorityChange(ticket.id_ticket, newPriority)}
                                        disabled={loading}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {ticket.createdBy}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(ticket.createdAt)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <button
                                        onClick={() => onDelete(ticket.id_ticket)}
                                        disabled={loading}
                                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const InfoPanel = () => (
    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start">
            <svg className="h-5 w-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
                <h4 className="text-sm font-medium text-blue-900">Petunjuk Penggunaan</h4>
                <ul className="mt-2 text-sm text-blue-700 space-y-1">
                    <li>Gunakan dropdown pada kolom <span className="font-semibold">Status</span> atau <span className="font-semibold">Prioritas</span> untuk mengubah langsung</li>
                    <li>Gunakan kotak pencarian untuk memfilter tiket berdasarkan ID, judul, atau pembuat</li>
                    <li>Tombol <span className="font-semibold">Hapus</span> akan menghapus tiket secara permanen setelah konfirmasi</li>
                </ul>
            </div>
        </div>
    </div>
)

const AdminPage = () => {
    const { keycloak, getValidToken } = useAuth()
    const [tickets, setTickets] = useState([])
    const [filteredTickets, setFilteredTickets] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [searchTerm, setSearchTerm] = useState('')

    const getAuthHeaders = useCallback(async () => {
        const token = await getValidToken()
        if (!token) {
            throw new Error('Token tidak tersedia')
        }
        return {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        }
    }, [getValidToken])

    const handleError = useCallback((err) => {
        console.error('API Error:', err)
        if (err.response?.status === 401) {
            return 'Token tidak valid, silakan login ulang'
        }
        if (err.response?.status === 403) {
            return 'Anda tidak memiliki akses ke resource ini'
        }
        return err.response?.data?.message || err.message || 'Terjadi kesalahan'
    }, [])

    const fetchTickets = useCallback(async () => {
        if (!keycloak?.token) return

        setLoading(true)
        setError('')

        try {
            const headers = await getAuthHeaders()
            const response = await fetch(`${API_BASE}/api/tickets`, { headers })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            const ticketList = data.data || []
            setTickets(ticketList)
            setFilteredTickets(ticketList)
        } catch (err) {
            const errorMessage = handleError(err)
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [keycloak?.token, getAuthHeaders, handleError])

    const handleSearch = useCallback((term) => {
        setSearchTerm(term)
        if (!term.trim()) {
            setFilteredTickets(tickets)
            return
        }

        const filtered = tickets.filter(ticket =>
            ticket.title?.toLowerCase().includes(term.toLowerCase()) ||
            ticket.createdBy?.toLowerCase().includes(term.toLowerCase()) ||
            ticket.id_ticket?.toString().includes(term)
        )
        setFilteredTickets(filtered)
    }, [tickets])

    const handleUpdateStatus = useCallback(async (ticketId, newStatus) => {
        setLoading(true)
        setError('')

        try {
            const headers = await getAuthHeaders()
            const response = await fetch(`${API_BASE}/api/tickets/${ticketId}/status`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ status: newStatus }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            await fetchTickets()
        } catch (err) {
            const errorMessage = handleError(err)
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [getAuthHeaders, handleError, fetchTickets])

    const handleUpdatePriority = useCallback(async (ticketId, newPriority) => {
        setLoading(true)
        setError('')

        try {
            const headers = await getAuthHeaders()
            const response = await fetch(`${API_BASE}/api/tickets/${ticketId}/priority`, {
                method: 'PUT',
                headers,
                body: JSON.stringify({ priority: newPriority }),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            await fetchTickets()
        } catch (err) {
            const errorMessage = handleError(err)
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [getAuthHeaders, handleError, fetchTickets])

    const handleDeleteTicket = useCallback(async (ticketId) => {
        if (!confirm('Apakah Anda yakin ingin menghapus tiket ini? Tindakan ini tidak dapat dibatalkan.')) return

        setLoading(true)
        setError('')

        try {
            const headers = await getAuthHeaders()
            const response = await fetch(`${API_BASE}/api/tickets/${ticketId}`, {
                method: 'DELETE',
                headers,
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            await fetchTickets()
        } catch (err) {
            const errorMessage = handleError(err)
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }, [getAuthHeaders, handleError, fetchTickets])

    useEffect(() => {
        if (keycloak?.token) {
            fetchTickets()
        }
    }, [keycloak?.token, fetchTickets])

    return (
        <section className="max-w-7xl mx-auto p-6">
            {loading && <LoadingOverlay />}

            <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Kelola Tiket</h2>
                <p className="text-gray-600 mt-1">Manajemen dan monitoring seluruh tiket helpdesk</p>
            </div>

            {error && <ErrorAlert message={error} />}

            <SearchBar
                searchTerm={searchTerm}
                onSearch={handleSearch}
                resultCount={filteredTickets.length}
                totalCount={tickets.length}
            />

            <TicketTable
                tickets={filteredTickets}
                onStatusChange={handleUpdateStatus}
                onPriorityChange={handleUpdatePriority}
                onDelete={handleDeleteTicket}
                loading={loading}
            />

            <InfoPanel />
        </section>
    )
}

export default AdminPage
