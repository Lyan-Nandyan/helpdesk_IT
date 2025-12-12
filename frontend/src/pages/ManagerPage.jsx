import { useEffect, useState, useCallback, useMemo } from 'react'
import { useAuth } from '../auth/AuthContext'

const API_BASE = import.meta.env.VITE_API_BASE

// Components
const StatCard = ({ value, label, colorScheme }) => {
    const colorClasses = {
        blue: 'border-blue-500 bg-blue-50 text-blue-700',
        green: 'border-green-500 bg-green-50 text-green-700',
        orange: 'border-orange-500 bg-orange-50 text-orange-700',
        gray: 'border-gray-500 bg-gray-50 text-gray-700',
        red: 'border-red-500 bg-red-50 text-red-700',
    }

    return (
        <div className={`border-2 rounded-lg p-4 text-center ${colorClasses[colorScheme]}`}>
            <div className="text-4xl font-bold mb-1">{value}</div>
            <div className="text-sm font-medium">{label}</div>
        </div>
    )
}

const ErrorAlert = ({ message }) => (
    <div className="border border-red-400 bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
        <p className="font-medium">{message}</p>
    </div>
)

const LoadingSpinner = ({ message }) => (
    <div className="flex items-center gap-2 text-gray-600">
        <div className="animate-spin h-4 w-4 border-2 border-gray-600 border-t-transparent rounded-full"></div>
        <span>{message}</span>
    </div>
)

const LogEntry = ({ log }) => {
    const formatTimestamp = (timestamp) => {
        if (!timestamp) return ''
        return new Date(timestamp).toLocaleString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        })
    }

    const getLevelColor = (level) => {
        const colors = {
            info: 'text-blue-600',
            warn: 'text-yellow-600',
            error: 'text-red-600',
        }
        return colors[level?.toLowerCase()] || 'text-gray-600'
    }

    const renderLogContent = () => {
        if (log.raw) {
            return <span className="text-gray-700">{log.raw}</span>
        }

        return (
            <>
                {log.message && (
                    <span className="font-semibold text-gray-800">{log.message}</span>
                )}
                {log.ticketId && (
                    <span className="text-gray-600"> | ID: {log.ticketId}</span>
                )}
                {log.title && (
                    <span className="text-gray-600"> | Title: "{log.title}"</span>
                )}
                {log.priority && (
                    <span className="text-gray-600"> | Priority: {log.priority}</span>
                )}
                {log.newStatus && (
                    <span className="text-gray-600"> | Status: {log.newStatus}</span>
                )}
                {log.newPriority && (
                    <span className="text-gray-600"> | New Priority: {log.newPriority}</span>
                )}
                {log.createdBy && (
                    <span className="text-gray-600"> | By: {log.createdBy}</span>
                )}
                {log.changedBy && (
                    <span className="text-gray-600"> | Changed By: {log.changedBy}</span>
                )}
                {log.changeby && (
                    <span className="text-gray-600"> | Changed By: {log.changeby}</span>
                )}
                {log.deletedBy && (
                    <span className="text-red-600"> | Deleted By: {log.deletedBy}</span>
                )}
            </>
        )
    }

    return (
        <div className="py-2 border-b border-gray-200 last:border-b-0 hover:bg-gray-50 px-2 rounded transition-colors">
            <div className="flex flex-wrap items-start gap-2 text-sm">
                {log.timestamp && (
                    <span className="text-gray-500 font-mono text-xs whitespace-nowrap">
                        [{formatTimestamp(log.timestamp)}]
                    </span>
                )}
                {log.level && (
                    <span className={`font-bold uppercase text-xs ${getLevelColor(log.level)}`}>
                        {log.level}
                    </span>
                )}
                <div className="flex-1">{renderLogContent()}</div>
            </div>
        </div>
    )
}

const ManagerPage = () => {
    const { keycloak } = useAuth()
    const [logs, setLogs] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [ticketCounts, setTicketCounts] = useState({
        all: 0,
        open: 0,
        closed: 0,
        inprogress: 0,
        priority: { high: 0, medium: 0, low: 0 }
    })
    const [isLoadingCounts, setIsLoadingCounts] = useState(false)

    const fetchLogs = useCallback(async () => {
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
    }, [keycloak?.token])

    const fetchTicketCounts = useCallback(async () => {
        setIsLoadingCounts(true)
        try {
            const [allRes, openRes, closedRes, inprogressRes, priorityRes] = await Promise.all([
                fetch(`${API_BASE}/api/tickets/count/all`, {
                    headers: { Authorization: `Bearer ${keycloak.token}` }
                }),
                fetch(`${API_BASE}/api/tickets/count/open`, {
                    headers: { Authorization: `Bearer ${keycloak.token}` }
                }),
                fetch(`${API_BASE}/api/tickets/count/closed`, {
                    headers: { Authorization: `Bearer ${keycloak.token}` }
                }),
                fetch(`${API_BASE}/api/tickets/count/inprogress`, {
                    headers: { Authorization: `Bearer ${keycloak.token}` }
                }),
                fetch(`${API_BASE}/api/tickets/count/priority`, {
                    headers: { Authorization: `Bearer ${keycloak.token}` }
                })
            ])

            const allData = await allRes.json()
            const openData = await openRes.json()
            const closedData = await closedRes.json()
            const inprogressData = await inprogressRes.json()
            const priorityData = await priorityRes.json()

            setTicketCounts({
                all: allData.count || 0,
                open: openData.count || 0,
                closed: closedData.count || 0,
                inprogress: inprogressData.count || 0,
                priority: priorityData.counts || { high: 0, medium: 0, low: 0 }
            })
        } catch (err) {
            console.error('Error fetching ticket counts:', err)
        } finally {
            setIsLoadingCounts(false)
        }
    }, [keycloak?.token])

    useEffect(() => {
        if (!keycloak?.token) return

        fetchLogs()
        fetchTicketCounts()
    }, [keycloak?.token, fetchLogs, fetchTicketCounts])

    const statsCards = useMemo(() => [
        { value: ticketCounts.all, label: 'Total Tiket', color: 'blue' },
        { value: ticketCounts.open, label: 'Open', color: 'green' },
        { value: ticketCounts.inprogress, label: 'In Progress', color: 'orange' },
        { value: ticketCounts.closed, label: 'Closed', color: 'gray' },
        { value: ticketCounts.priority.high, label: 'High Priority', color: 'red' },
        { value: ticketCounts.priority.medium, label: 'Medium Priority', color: 'orange' },
        { value: ticketCounts.priority.low, label: 'Low Priority', color: 'green' },
    ], [ticketCounts])

    return (
        <section className="max-w-7xl mx-auto p-6">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Manager</h2>

            {error && <ErrorAlert message={error} />}

            <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Statistik Tiket</h3>

                {isLoadingCounts ? (
                    <LoadingSpinner message="Memuat statistik..." />
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                        {statsCards.map((card, index) => (
                            <StatCard
                                key={index}
                                value={card.value}
                                label={card.label}
                                colorScheme={card.color}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="bg-white rounded-lg shadow-md">
                <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="text-xl font-semibold text-gray-700">
                        Log Aplikasi
                        <span className="text-sm font-normal text-gray-500 ml-2">
                            (50 baris terakhir)
                        </span>
                    </h3>
                </div>

                <div className="overflow-y-auto max-h-96 bg-gray-50">
                    {isLoading ? (
                        <div className="p-6">
                            <LoadingSpinner message="Memuat log..." />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            <p>Belum ada log aktivitas.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-200">
                            {logs.map((log, index) => (
                                <LogEntry key={index} log={log} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

export default ManagerPage
