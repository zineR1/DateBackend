import { Router } from "express";
import { getTickets, createTicket, getTicketById, updateTicket, deleteTicket } from '../controllers/tickets.js';

const router = Router();

router.get('/tickets', getTickets);
router.get('/tickets/:id', getTicketById);
router.post('/tickets', createTicket);
router.put('/tickets/:id', updateTicket)
router.delete('/tickets/:id', deleteTicket)

export default router;

/* 
    1- cuando un usuario compra x nro de entradas suceden 3 cosas

        a- se crea una fila por cada ticket comprado en la tabla tickets
        b- se crea un objeto por cada ticket comprado en el array entradas del evento
        c- se crea un solo objeto con la entrada asignada al username en el array entradas del usuario
*/