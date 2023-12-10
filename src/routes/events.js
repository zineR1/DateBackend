import { Router } from "express";
import {
  getEvents,
  deleteEvent,
  soldTickets,
  agregarInvitado,
  getEventById,
  getOrganizadores,
  addOrganizadores,
  deleteOrganizador,
  upload,
  // addInvitado,
  // addComprobantes,
  deleteComprobante,
  updateComprobante,
} from "../controllers/events.js";
import {
  createEvent,
  uploadEvent,
  editEvent,
  changeEventPicture,
  uploadEventImage,
  deleteEventPicture,
} from "../controllers/eventCreator.js";

const router = Router();

//router.post('/events/:id/guests', upload.single('file') ,addInvitado);
//router.post('events/:id/comprobantes', upload.single('file'), addComprobantes);

//EVENTOS
router.get("/events", getEvents);
router.get("/events/:id", getEventById);
router.post("/events", uploadEvent.single("file"), createEvent);
router.post(
  "/events/:id/changePicture",
  uploadEvent.single("file"),
  changeEventPicture
);
router.delete("/events/:id", deleteEvent);
router.delete("/events/:id/deleteEventPicture", deleteEventPicture);
router.put("/events/:id/updateEvent", editEvent);
router.put(
        "/events/:id/uploadImage",
  uploadEvent.single("file"),
  uploadEventImage
);

//ORGANIZADORES
router.get("/events/:eventId/organizers", getOrganizadores);
router.put("/events/:eventId/organizadores/:userId", addOrganizadores);
router.put("/events/:eventId/delete-organizador/:userId", deleteOrganizador);

//COMPROBANTES
// router.post(
//         "/events/:id/:userName/uploadComprobante/:posicion",
//         upload.single("file"),
//   updateComprobante
// );
// router.delete("/events/:id/deleteComprobante/:posicion", deleteComprobante);

//TICKETS
router.put("/events", soldTickets);

//INVITADOS
router.put("/events/invitados", agregarInvitado);

export default router;
