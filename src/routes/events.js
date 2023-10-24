import { Router } from 'express';
import { getEvents, createEvent, deleteEvent, soldTickets, agregarInvitado } from '../controllers/events.js';

const router = Router();

router.get('/events', getEvents);
router.post('/events', createEvent);
router.delete('/events/:id', deleteEvent);
router.put('/events', soldTickets)
router.put('/events/invitados', agregarInvitado);

export default router;