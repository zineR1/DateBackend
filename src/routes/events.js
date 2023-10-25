import { Router } from 'express';
import { getEvents, 
         createEvent, 
         deleteEvent, 
         soldTickets, 
         agregarInvitado,
         getEventById,
         addOrganizadores,
         deleteOrganizador
        } from '../controllers/events.js';

const router = Router();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events', createEvent);
router.delete('/events/:id', deleteEvent);
router.put('/events', soldTickets);
router.put('/events/invitados', agregarInvitado);
router.put('/events/:id/organizadores', addOrganizadores);
router.put('/events/:id/delete-organizador', deleteOrganizador);



export default router;