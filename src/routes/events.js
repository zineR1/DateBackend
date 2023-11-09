import { Router } from 'express';
import { getEvents,
         deleteEvent, 
         soldTickets, 
         agregarInvitado,
         getEventById,
         addOrganizadores,
         deleteOrganizador,
         upload,
        // addInvitado,
        // addComprobantes,
         deleteComprobante,
         updateComprobante,
         } from '../controllers/events.js';
import { createEvent, uploadEvent, editEvent, changeEventPicture } from '../controllers/eventCreator.js'

const router = Router();

router.get('/events', getEvents);
router.get('/events/:id', getEventById);
router.post('/events',uploadEvent.single('file'), createEvent);
//router.post('/events/:id/guests', upload.single('file') ,addInvitado);
//router.post('events/:id/comprobantes', upload.single('file'), addComprobantes);
router.post('/events/:id/:userName/uploadComprobante/:posicion', upload.single('file'),updateComprobante);
router.post('/events/:id/changePicture', uploadEvent.single('file'), changeEventPicture);
router.delete('/events/:id', deleteEvent);
router.delete('/events/:id/deleteComprobante/:posicion', deleteComprobante);
router.put('/events', soldTickets);
router.put('/events/invitados', agregarInvitado);
router.put('/events/:id/organizadores', addOrganizadores);
router.put('/events/:id/delete-organizador', deleteOrganizador);
router.put('/events/:id/updateEvent', editEvent)



export default router;