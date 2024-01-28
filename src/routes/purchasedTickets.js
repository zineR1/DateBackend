import { Router } from "express";
import {
  getTickets,
  createTicket,
  getTicketById,
  updateTicket,
  deleteTicket,
  transferTicket,
} from "../controllers/purchasedTickets.js";

const router = Router();

router.get("/tickets", getTickets);
router.get("/tickets/:id", getTicketById);
router.post("/tickets", createTicket);
router.put("/tickets/:id", updateTicket);
router.put("/tickets/transfer/:eventId/:ticketId/:userIdBuyer/:userIdReceiver", transferTicket);
router.delete("/tickets/:id", deleteTicket);

export default router;
