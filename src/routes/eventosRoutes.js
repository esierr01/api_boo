import express from "express";
import { createEvento, getEventos, getEventoById, updateEvento, deleteEvento } from "../controllers/eventosController.js";

const router = express.Router();

router.post("/", createEvento);
router.get("/", getEventos);
router.get("/:id", getEventoById);
router.put("/:id", updateEvento);
router.delete("/:id", deleteEvento);

export default router;
