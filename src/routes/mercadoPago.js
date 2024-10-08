import { Router } from "express";
import { createOrder, createMPToken, receiveWebHook } from "../controllers/mercadoPago.js";

const router = Router();

router.post("/create-order", createOrder);
router.post("/createMPToken", createMPToken);
router.get("/success", (req, res) => res.send("success"));
router.get("/failure", (req, res) => res.send("failure"));
router.get("/pending", (req, res) => res.send("pending"));
router.post("/webhook", receiveWebHook);

export default router;
