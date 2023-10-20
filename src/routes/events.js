import { Router } from 'express';
import { getEvents, createEvent, deleteEvent, soldTickets } from '../controllers/events.js';

const router = Router();

router.get('/events', getEvents);
router.post('/events', createEvent);
router.delete('/events/:id', deleteEvent);
router.put('/events', soldTickets)

export default router;