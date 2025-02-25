import Evento from "../models/Evento.js";
import Usuario from "../models/Usuario.js";
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

// Crear un nuevo evento
export const createEvento = async (req, res) => {
  req.body.fechaCreacion = obtenerFecha() + " - " + obtenerHora();

  try {
    const usuarioExistente = await Usuario.findById(req.body.idUsuario);
    if (!usuarioExistente) {
      return res.status(400).json({ error: "El usuario no existe" });
    }

    // Convertir mitoLeyenda de cadena a booleano
    if (typeof req.body.mitoLeyenda === "string") {
      if (req.body.mitoLeyenda.toLowerCase() === "true") {
        req.body.mitoLeyenda = true;
      } else if (req.body.mitoLeyenda.toLowerCase() === "false") {
        req.body.mitoLeyenda = false;
      } else {
        return res.status(400).json({ error: "El campo mitoLeyenda debe ser 'true' o 'false'" });
      }
    }

    const evento = new Evento(req.body);
    await evento.save();
    res.status(201).json(evento);
  } catch (err) {
    console.error("Error al crear evento:", err);
    res.status(500).json({ error: "Ocurrió un error al crear el evento" });
  }
};

// Obtener todos los eventos
export const getEventos = async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.status(200).json(eventos);
  } catch (err) {
    console.error("Error al obtener eventos:", err);
    res.status(500).json({ error: "Ocurrió un error al obtener los eventos" });
  }
};

// Obtener un evento por ID
export const getEventoById = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });
    res.status(200).json(evento);
  } catch (err) {
    console.error("Error al obtener evento por ID:", err);
    res.status(500).json({ error: "Ocurrió un error al obtener el evento" });
  }
};

// Actualizar un evento
export const updateEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    const eventoActualizado = await Evento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(eventoActualizado);
  } catch (err) {
    console.error("Error al actualizar evento:", err);
    res.status(500).json({ error: "Ocurrió un error al actualizar el evento" });
  }
};

// Eliminar un evento
export const deleteEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    // Actualizar el campo "activo" a false
    evento.activo = false;
    await evento.save();

    res.status(200).json({ message: "Evento desactivado correctamente" });
  } catch (err) {
    console.error("Error al desactivar evento:", err);
    res.status(500).json({ error: "Ocurrió un error al desactivar el evento" });
  }
};