import express from 'express'
import { createTicket, getTickets, getMyTickets, getAllTicketsCount, getOpenTicketsCount, getClosedTicketsCount, getPriorityTicketsCount } from '../controllers/ticketController.js'
import { authenticate, authorizeRoles } from '../middleware/auth.js'

const router = express.Router()
router.get('/', authenticate, authorizeRoles('admin'), getTickets)
router.post('/', authenticate,authorizeRoles('user'), createTicket)
router.get('/my', authenticate, authorizeRoles('user'), getMyTickets)
router.get('/count/all', authenticate, authorizeRoles('admin', 'manager'), getAllTicketsCount)
router.get('/count/open', authenticate, authorizeRoles('admin', 'manager'), getOpenTicketsCount)
router.get('/count/closed', authenticate, authorizeRoles('admin', 'manager'), getClosedTicketsCount)
router.get('/count/priority', authenticate, authorizeRoles('admin', 'manager'), getPriorityTicketsCount)
export default router