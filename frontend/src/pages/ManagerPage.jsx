import { useEffect, useState } from 'react'
import { useAuth } from '../auth/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE

function ManagerPage() {
  const { keycloak } = useAuth()
  const [logs, setLogs] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!keycloak?.token) return

    const fetchLogs = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await fetch(`${API_BASE}/api/logs`, {
          headers: {
            Authorization: `Bearer ${keycloak.token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const responseData = await response.json()
        const fetchedLogs = responseData.data || []
        setLogs(fetchedLogs)
      } catch (err) {
        console.error('Error fetching logs:', err)
        setError(err.message || 'Gagal memuat log aplikasi')
      } finally {
        setIsLoading(false)
      }
    }

    fetchLogs()
  }, [keycloak?.token])

  const renderLogEntry = (log, index) => (
    <div key={index} style={{ marginBottom: 4 }}>
      {log.timestamp && <span>[{new Date(log.timestamp).toLocaleString()}] </span>}
      {log.level && <span style={{ fontWeight: 'bold' }}>({log.level.toUpperCase()}) </span>}
      {log.message && <span>{log.message} </span>}
      {log.ticketId && <span>ticketId={log.ticketId} </span>}
      {log.title && <span>title="{log.title}" </span>}
      {log.priority && <span>priority={log.priority} </span>}
      {log.createdBy && <span>by={log.createdBy}</span>}
      {log.raw && <span>{log.raw}</span>}
    </div>
  )

  return (
    <section>
      <h2>Dashboard Manager</h2>

      {error && (
        <div style={{ 
          border: '1px solid red', 
          padding: 8, 
          marginBottom: 8,
          backgroundColor: '#ffebee',
          borderRadius: 4
        }}>
          {error}
        </div>
      )}

      <h3>Log Aplikasi (50 baris terakhir)</h3>
      <div
        style={{
          border: '1px solid #ccc',
          padding: 8,
          maxHeight: 250,
          overflowY: 'auto',
          fontFamily: 'monospace',
          fontSize: 12,
          backgroundColor: '#f5f5f5',
          borderRadius: 4
        }}
      >
        {isLoading ? (
          <p>Memuat log...</p>
        ) : logs.length === 0 ? (
          <p>Belum ada log.</p>
        ) : (
          logs.map(renderLogEntry)
        )}
      </div>
    </section>
  )
}

export default ManagerPage
