export const cekHealth = (req, res) => {
  try {
    const healthStatus = {
      status: 'ok',
      message: 'Backend Helpdesk IT running',
      timestamp: new Date().toISOString(),
    }

    return res.status(200).json(healthStatus)
  } catch (error) {
    console.error('Health check error:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Failed to check health status',
      timestamp: new Date().toISOString(),
    })
  }
}
