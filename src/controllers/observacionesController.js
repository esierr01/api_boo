import Observacion from "../models/Observacion.js";
import Usuario from "../models/Usuario.js"; // Importar el modelo de Usuario
import Evento from "../models/Evento.js"; // Importar el modelo de Evento
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

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
    res.status(400).json({ error: err.message });
  }
};

export const getObservaciones = async (req, res) => {
  try {
    const observaciones = await Observacion.find();
    res.status(200).json(observaciones);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getObservacionById = async (req, res) => {
  try {
    const observacion = await Observacion.findById(req.params.id);
    if (!observacion)
      return res.status(404).json({ error: "Observacion no encontrada" });
    res.status(200).json(observacion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateObservacion = async (req, res) => {
  try {
    const observacion = await Observacion.findById(req.params.id);
    if (!observacion) {
      return res.status(404).json({ error: "Observación no encontrada" });
    }

    // Verificar si se está agregando una respuesta
    if (req.body.respuesta) {
      // Validar que el idUsuarRespuesta exista en la colección de usuarios
      const usuarioExistente = await Usuario.findById(
        req.body.idUsuarRespuesta
      );
      if (!usuarioExistente) {
        return res
          .status(400)
          .json({ error: "El usuario que responde no existe" });
      }

      // Asignar la fecha de respuesta
      req.body.fechaRespuesta = new Date();
    }

    // Actualizar la observación
    const observacionActualizada = await Observacion.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(observacionActualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteObservacion = async (req, res) => {
  try {
    const observacion = await Observacion.findByIdAndDelete(req.params.id);
    if (!observacion)
      return res.status(404).json({ error: "Observacion no se encuentra" });
    res.status(200).json({ message: "Observacion borrada satisfactoriamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const responderObservacion = async (req, res) => {
  try {
    const { id } = req.params; // ID de la observación
    const { respuesta, idUsuarRespuesta } = req.body; // Datos proporcionados por el usuario

    // Verificar que se proporcionen los campos requeridos
    if (!respuesta || !idUsuarRespuesta) {
      return res.status(400).json({
        error: "Faltan campos requeridos: respuesta e idUsuarRespuesta",
      });
    }

    // Verificar si el idUsuarRespuesta existe en la colección de usuarios
    const usuarioExistente = await Usuario.findById(idUsuarRespuesta);
    if (!usuarioExistente) {
      return res
        .status(400)
        .json({ error: "El usuario que responde no existe" });
    }

    // Actualizar los campos específicos
    const observacionActualizada = await Observacion.findByIdAndUpdate(
      id,
      {
        mensaRespondido: true, // Marcar como respondido
        respuesta, // Respuesta proporcionada por el usuario
        idUsuarRespuesta, // ID del usuario que responde
        fechaRespuesta: obtenerFecha() + " - " + obtenerHora(), // Fecha y hora actual
      },
      { new: true } // Devolver el documento actualizado
    );

    if (!observacionActualizada) {
      return res.status(404).json({ error: "Observación no encontrada" });
    }

    res.status(200).json(observacionActualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
