import { useEffect, useState, useCallback, useMemo } from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Rendah', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { value: 'medium', label: 'Sedang', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { value: 'high', label: 'Tinggi', color: 'bg-red-100 text-red-800 border-red-300' },
]

const STATUS_CONFIG = {
  open: { label: 'Open', color: 'bg-green-100 text-green-800 border-green-300' },
  inprogress: { label: 'In Progress', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  closed: { label: 'Closed', color: 'bg-gray-100 text-gray-800 border-gray-300' },
}

const DEFAULT_PRIORITY = 'medium'

// Components
const ErrorAlert = ({ message, onDismiss }) => (
  <div className="border border-red-400 bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
    <p className="font-medium">{message}</p>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-red-700 hover:text-red-900 font-bold"
      >
        ×
      </button>
    )}
  </div>
)

const SuccessAlert = ({ message, onDismiss }) => (
  <div className="border border-green-400 bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
    <p className="font-medium">{message}</p>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-green-700 hover:text-green-900 font-bold"
      >
        ×
      </button>
    )}
  </div>
)

const LoadingSpinner = ({ message }) => (
  <div className="flex items-center gap-2 text-gray-600">
    <div className="animate-spin h-5 w-5 border-3 border-blue-600 border-t-transparent rounded-full"></div>
    <span className="font-medium">{message}</span>
  </div>
)

const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.open
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      {config.label}
    </span>
  )
}

const PriorityBadge = ({ priority }) => {
  const config = PRIORITY_OPTIONS.find(opt => opt.value === priority) || PRIORITY_OPTIONS[1]
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${config.color}`}>
      {config.label}
    </span>
  )
}

const CreateTicketForm = ({ onSubmit, loading }) => {
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState(DEFAULT_PRIORITY)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ title, priority })
    setTitle('')
    setPriority(DEFAULT_PRIORITY)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-800">Buat Tiket Baru</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Judul Masalah
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Internet lambat di lantai 2"
            disabled={loading}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prioritas
          </label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            disabled={loading}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={loading || !title.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Mengirim...
            </>
          ) : (
            <>
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
              Kirim Tiket
            </>
          )}
        </button>
      </form>
    </div>
  )
}

const TicketTable = ({ tickets, loading }) => {
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
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">Belum Ada Tiket</h3>
        <p className="mt-2 text-sm text-gray-500">Mulai dengan membuat tiket baru untuk melaporkan masalah IT Anda.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Judul
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prioritas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dibuat Pada
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tickets.map((ticket) => (
              <tr key={ticket.id_ticket || ticket.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{ticket.id_ticket || ticket.id}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  <div className="max-w-md" title={ticket.title}>
                    {ticket.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(ticket.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const TicketsPage = () => {
  const { keycloak, hasRole, getValidToken } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  const canCreateTicket = hasRole('user')

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
      const { data } = await axios.get(`${API_BASE}/api/tickets/my`, { headers })

      const ticketList = data.data || data
      setTickets(Array.isArray(ticketList) ? ticketList : [])
    } catch (err) {
      const errorMessage = handleError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [keycloak?.token, getAuthHeaders, handleError])

  const handleCreateTicket = useCallback(async ({ title, priority }) => {
    if (!title.trim()) {
      setError('Judul tiket wajib diisi')
      return
    }

    if (!keycloak?.token) {
      setError('Token tidak tersedia, silakan login ulang')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const headers = await getAuthHeaders()
      const payload = {
        title: title.trim(),
        priority,
      }

      const { data } = await axios.post(
        `${API_BASE}/api/tickets`,
        payload,
        { headers }
      )

      setSuccess('Tiket berhasil dibuat!')
      await fetchTickets()
      
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      const errorMessage = handleError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [keycloak?.token, getAuthHeaders, handleError, fetchTickets])

  useEffect(() => {
    if (keycloak?.token) {
      fetchTickets()
    }
  }, [keycloak?.token, fetchTickets])

  const ticketStats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    inprogress: tickets.filter(t => t.status === 'inprogress').length,
    closed: tickets.filter(t => t.status === 'closed').length,
  }), [tickets])

  return (
    <section className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Tiket Helpdesk</h2>
        <p className="text-gray-600 mt-1">Kelola dan pantau tiket masalah IT Anda</p>
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError('')} />}
      {success && <SuccessAlert message={success} onDismiss={() => setSuccess('')} />}

      {canCreateTicket && (
        <CreateTicketForm onSubmit={handleCreateTicket} loading={loading} />
      )}

      <div className="mb-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-700">{ticketStats.total}</div>
          <div className="text-sm font-medium text-blue-600">Total Tiket</div>
        </div>
        <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-700">{ticketStats.open}</div>
          <div className="text-sm font-medium text-green-600">Open</div>
        </div>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-yellow-700">{ticketStats.inprogress}</div>
          <div className="text-sm font-medium text-yellow-600">In Progress</div>
        </div>
        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-gray-700">{ticketStats.closed}</div>
          <div className="text-sm font-medium text-gray-600">Closed</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Daftar Tiket Saya</h3>
        {loading && !tickets.length && <LoadingSpinner message="Memuat tiket..." />}
      </div>

      <TicketTable tickets={tickets} loading={loading} />
    </section>
  )
}

export default TicketsPage
