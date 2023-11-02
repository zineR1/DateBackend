import { Router } from 'express';
import { getEvents,
         deleteEvent, 
         soldTickets, 
         agregarInvitado,
         getEventById,
         addOrganizadores,
         deleteOrganizador,
         upload,
         addInvitado,
         addComprobantes,
        } from '../controllers/events.js';
import { createEvent, uploadEvent, editEvent } from '../controllers/eventCreator.js'

const router = Router();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events',uploadEvent.single('file'), createEvent);
router.post('/events/:id/guests', upload.single('file') ,addInvitado);
router.post('events/:id/comprobantes', upload.single('file'), addComprobantes);
router.delete('/events/:id', deleteEvent);
router.put('/events', soldTickets);
router.put('/events/invitados', agregarInvitado);
router.put('/events/:id/organizadores', addOrganizadores);
router.put('/events/:id/delete-organizador', deleteOrganizador);
router.put('/events/:id/updateEvent', editEvent)



export default router;