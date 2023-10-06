import { Router } from "express";
import { getTickets, createTicket, getTicketById, updateTicket, deleteTicket } from '../controllers/tickets.js';

const router = Router();

router.get('/tickets', getTickets);
router.get('/tickets/:id', getTicketById);
router.post('/tickets', createTicket);
router.put('/tickets/:id', updateTicket)
router.delete('/tickets/:id', deleteTicket)

export default router;