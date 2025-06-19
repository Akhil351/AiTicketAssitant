import express from "express";
import { createTicket, getTicket, getTickets } from "../controller/ticket.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", authenticate, getTickets);
router.get("/:id", authenticate, getTicket);
router.post("/", authenticate, createTicket);

export default router;
