import { Router } from "express";
import {
  sendBondRequest,
  respondToBondRequest,
  getPendingBondRequests,
} from "../controllers/bondRequests.js";
import { getBondsById } from "../controllers/bonds.js";

const router = Router();

// Vinculaciones
router.get("/bonds/getBonds/:userId", getBondsById);
// router.delete("/bonds/deleteBond", deleteBond);

//Solicitudes de vinculación
router.get(
  "/users/:userId/events/:eventId/bondRequests",
  getPendingBondRequests
);
router.post("/bonds/request", sendBondRequest);
router.put("/bonds/respond", respondToBondRequest);

export default router;
