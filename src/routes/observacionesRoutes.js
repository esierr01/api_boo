import express from "express";
import {
  createObservacion,
  getObservaciones,
  getObservacionById,
  updateObservacion,
  deleteObservacion,
  responderObservacion,
} from "../controllers/observacionesController.js";

const router = express.Router();

router.post("/", createObservacion);
router.get("/", getObservaciones);
router.get("/:id", getObservacionById);
router.put("/:id", updateObservacion);
router.put("/:id/responder", responderObservacion);
router.delete("/:id", deleteObservacion);

export default router;
