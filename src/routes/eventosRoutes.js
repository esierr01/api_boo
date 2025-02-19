import express from "express";
import {
  createEvento,
  getEventos,
  getEventoById,
  updateEvento,
  deleteEvento,
  aprobarRechazarEvento,
} from "../controllers/eventosController.js";
import upload from "../utils/fileUpload.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "urlImagen", maxCount: 1 },
    { name: "urlVideo", maxCount: 1 },
  ]),
  createEvento
);
router.get("/", getEventos);
router.get("/:id", getEventoById);
router.put(
  "/:id",
  upload.fields([
    { name: "urlImagen", maxCount: 1 },
    { name: "urlVideo", maxCount: 1 },
  ]),
  updateEvento
);
router.put("/:id/aprobar-rechazar", aprobarRechazarEvento);
router.delete("/:id", deleteEvento);

export default router;
