import { Router } from "express";
import {
  sendBondRequest,
  respondToBondRequest,
  getPendingBondRequests,
  checkBondRequestsStatus,
} from "../controllers/bondRequests.js";
import { getBondsById } from "../controllers/bonds.js";

const router = Router();

// Vinculaciones
router.get("/bonds/getBonds/:userId", getBondsById);
// router.delete("/bonds/deleteBond", deleteBond);

//Solicitudes de vinculación
router.get("/bonds/bondRequests/:userId/:eventId", getPendingBondRequests);
router.post("/bonds/bondRequests/request", sendBondRequest);
router.put("/bonds/bondRequests/respond", respondToBondRequest);
router.get(
  "/bonds/checkBondRequestsStatus/:userId/:guestId/:eventId",
  checkBondRequestsStatus
);
export default router;
