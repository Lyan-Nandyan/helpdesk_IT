// dummy in-memory
const tickets = [
  {
    id: 1,
    title: 'Internet lambat di lantai 2',
    status: 'open',
    createdBy: 'user1',
    priority: 'high',
  },
]

export const getTickets = (req, res) => {
  try {
    return res.status(200).json({
      status: 'success',
      data: tickets,
    })
  } catch (error) {
    console.error('Error fetching tickets:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch tickets',
    })
  }
}

export const createTicket = (req, res) => {
  try {
    const { title, priority } = req.body

    // Validation
    if (!title || title.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Title wajib diisi',
      })
    }

    // Get user information
    const createdBy = req.user?.preferred_username || req.user?.email || 'unknown'

    // Create new ticket
    const newTicket = {
      id: tickets.length + 1,
      title: title.trim(),
      priority: priority || 'medium',
      status: 'open',
      createdBy,
      createdAt: new Date().toISOString(),
    }

    tickets.push(newTicket)

    return res.status(201).json({
      status: 'success',
      message: 'Ticket created successfully',
      data: newTicket,
    })
  } catch (error) {
    console.error('Error creating ticket:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Failed to create ticket',
    })
  }
}

export const getMyTickets = (req, res) => {
  try {
    const username = req.user?.preferred_username || req.user?.email || 'unknown'

    const myTickets = tickets.filter((ticket) => ticket.createdBy === username)

    return res.status(200).json({
      status: 'success',
      data: myTickets,
      count: myTickets.length,
    })
  } catch (error) {
    console.error('Error fetching user tickets:', error)

    return res.status(500).json({
      status: 'error',
      message: 'Failed to fetch user tickets',
    })
  }
}