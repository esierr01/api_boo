import Observacion from "../models/Observacion.js";
import Usuario from "../models/Usuario.js"; // Importar el modelo de Usuario
import Evento from "../models/Evento.js"; // Importar el modelo de Evento
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

// Crear una nueva observación
export const createObservacion = async (req, res) => {
  req.body.fechaEnvio = obtenerFecha() + " - " + obtenerHora();

  try {
    // Verificar si el idUsuario existe en la colección de usuarios
    const usuarioExistente = await Usuario.findById(req.body.idUsuario);
    if (!usuarioExistente) {
      return res.status(400).json({ error: "El usuario no existe" });
    }

    // Verificar si el idEvento existe en la colección de eventos
    const eventoExistente = await Evento.findById(req.body.idEvento);
    if (!eventoExistente) {
      return res.status(400).json({ error: "El evento no existe" });
    }

    // Crear y guardar la observación
    const observacion = new Observacion(req.body);
    await observacion.save();
    res.status(201).json(observacion);
  } catch (err) {
    console.error("Error al crear observación:", err);
    res.status(500).json({ error: "Ocurrió un error al crear la observación" });
  }
};

// Obtener todas las observaciones
export const getObservaciones = async (req, res) => {
  try {
    const observaciones = await Observacion.find();
    res.status(200).json(observaciones);
  } catch (err) {
    console.error("Error al obtener observaciones:", err);
    res.status(500).json({ error: "Ocurrió un error al obtener las observaciones" });
  }
};

// Obtener una observación por ID
export const getObservacionById = async (req, res) => {
  try {
    const observacion = await Observacion.findById(req.params.id);
    if (!observacion) {
      return res.status(404).json({ error: "Observación no encontrada" });
    }
    res.status(200).json(observacion);
  } catch (err) {
    console.error("Error al obtener observación por ID:", err);
    res.status(500).json({ error: "Ocurrió un error al obtener la observación" });
  }
};

// Actualizar una observación
export const updateObservacion = async (req, res) => {
  try {
    const observacion = await Observacion.findById(req.params.id);
    if (!observacion) {
      return res.status(404).json({ error: "Observación no encontrada" });
    }

    // Verificar si se está agregando una respuesta
    if (req.body.respuesta) {
      // Validar que el idUsuarRespuesta exista en la colección de usuarios
      const usuarioExistente = await Usuario.findById(req.body.idUsuarRespuesta);
      if (!usuarioExistente) {
        return res.status(400).json({ error: "El usuario que responde no existe" });
      }
      // Asignar la fecha de respuesta
      req.body.fechaRespuesta = obtenerFecha() + " - " + obtenerHora();
    }

    // Actualizar la observación
    const observacionActualizada = await Observacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(observacionActualizada);
  } catch (err) {
    console.error("Error al actualizar observación:", err);
    res.status(500).json({ error: "Ocurrió un error al actualizar la observación" });
  }
};

// Eliminar una observación
export const deleteObservacion = async (req, res) => {
  try {
    const observacion = await Observacion.findByIdAndDelete(req.params.id);
    if (!observacion) {
      return res.status(404).json({ error: "Observación no encontrada" });
    }
    res.status(200).json({ message: "Observación borrada satisfactoriamente" });
  } catch (err) {
    console.error("Error al eliminar observación:", err);
    res.status(500).json({ error: "Ocurrió un error al eliminar la observación" });
  }
};