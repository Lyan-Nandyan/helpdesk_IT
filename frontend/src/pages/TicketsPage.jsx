import { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { useAuth } from '../auth/AuthContext'

// Constants
const API_BASE = import.meta.env.VITE_API_BASE
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Rendah' },
  { value: 'medium', label: 'Sedang' },
  { value: 'high', label: 'Tinggi' },
]
const DEFAULT_PRIORITY = 'medium'

const TicketsPage = () => {
  const { keycloak, hasRole, getValidToken } = useAuth()
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [title, setTitle] = useState('')
  const [priority, setPriority] = useState(DEFAULT_PRIORITY)
  
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
    if (!keycloak?.token) {
      console.warn('Token tidak tersedia, skip fetch tickets')
      return
    }

    setLoading(true)
    setError('')

    try {
      const headers = await getAuthHeaders()
      const { data } = await axios.get(`${API_BASE}/api/tickets/my`, { headers })

      const ticketList = data.data || data
      setTickets(Array.isArray(ticketList) ? ticketList : [])
      console.log('Tickets loaded:', ticketList.length)
    } catch (err) {
      const errorMessage = handleError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [keycloak?.token, getAuthHeaders, handleError])

  const handleCreateTicket = useCallback(async (e) => {
    e.preventDefault()

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

      const newTicket = data.data || data
      setTickets((prev) => [...prev, newTicket])
      
      // Reset form
      setTitle('')
      setPriority(DEFAULT_PRIORITY)
      
      console.log('Ticket created:', newTicket)
    } catch (err) {
      const errorMessage = handleError(err)
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [title, priority, keycloak?.token, getAuthHeaders, handleError])

  // Fetch tickets saat component mount atau token berubah
  useEffect(() => {
    if (keycloak?.token) {
      fetchTickets()
    }
  }, [keycloak?.token, fetchTickets])

  return (
    <section>
      <h2>Tiket Helpdesk</h2>

      {error && (
        <div style={{ padding: '8px', marginBottom: '8px', border: '1px solid red', color: 'red' }}>
          {error}
        </div>
      )}

      {loading && <p>Sedang memuat...</p>}

      {/* Form buat tiket baru, hanya untuk role "user" */}
      {canCreateTicket && (
        <div style={{ marginBottom: '16px', padding: '12px', border: '1px solid #ccc' }}>
          <h3>Buat Tiket Baru</h3>
          <form onSubmit={handleCreateTicket}>
            <div style={{ marginBottom: '8px' }}>
              <label>
                Judul masalah:{' '}
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Internet lambat di lantai 2"
                  style={{ width: '100%' }}
                  disabled={loading}
                />
              </label>
            </div>

            <div style={{ marginBottom: '8px' }}>
              <label>
                Prioritas:{' '}
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  disabled={loading}
                >
                  {PRIORITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim Tiket'}
            </button>
          </form>
        </div>
      )}

      {/* List tiket */}
      <h3>Daftar Tiket</h3>
      {tickets.length === 0 && !loading ? (
        <p>Belum ada tiket.</p>
      ) : (
        <table border="1" cellPadding="6" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Judul</th>
              <th>Status</th>
              <th>Prioritas</th>
              <th>Dibuat oleh</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.title}</td>
                <td>{ticket.status}</td>
                <td>{ticket.priority}</td>
                <td>{ticket.createdBy}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default TicketsPage
