import express from 'express'
import { createTicket, getTickets, getMyTickets } from '../controllers/ticketController.js'
import { authenticate, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()
router.get('/', authenticate, authorizeRoles('user', 'admin', 'manager'), getTickets)
router.post('/', authenticate,authorizeRoles('user'), createTicket)
router.get('/my', authenticate, authorizeRoles('user'), getMyTickets)
export default router