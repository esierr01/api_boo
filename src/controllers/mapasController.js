import Mapa from "../models/Mapa.js";
import Usuario from "../models/Usuario.js";
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

// Crear un nuevo mapa
export const createMapa = async (req, res) => {
  req.body.fechaCreacion = obtenerFecha() + " - " + obtenerHora();

  try {
    // Verificar si el usuario existe
    const usuario = await Usuario.findById(req.body.idUsuario);
    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Si el usuario existe, crear el mapa
    const mapa = new Mapa(req.body);
    await mapa.save();
    res.status(201).json(mapa);
  } catch (err) {
    console.error("Error al crear mapa:", err);
    res.status(500).json({ error: "Ocurrió un error al crear el mapa" });
  }
};

// Obtener todos los mapas
export const getMapas = async (req, res) => {
  try {
    const mapas = await Mapa.find();
    res.status(200).json(mapas);
  } catch (err) {
    console.error("Error al obtener mapas:", err);
    res.status(500).json({ error: "Ocurrió un error al obtener los mapas" });
  }
};

// Obtener un mapa por ID
export const getMapaById = async (req, res) => {
  try {
    const mapa = await Mapa.findById(req.params.id);
    if (!mapa) return res.status(404).json({ error: "Mapa no encontrado" });
    res.status(200).json(mapa);
  } catch (err) {
    console.error("Error al obtener mapa por ID:", err);
    res.status(500).json({ error: "Ocurrió un error al obtener el mapa" });
  }
};

// Actualizar un mapa
export const updateMapa = async (req, res) => {
  try {
    const mapa = await Mapa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!mapa) return res.status(404).json({ error: "Mapa no encontrado" });
    res.status(200).json(mapa);
  } catch (err) {
    console.error("Error al actualizar mapa:", err);
    res.status(500).json({ error: "Ocurrió un error al actualizar el mapa" });
  }
};

// Eliminar un mapa
export const deleteMapa = async (req, res) => {
  try {
    const mapa = await Mapa.findByIdAndDelete(req.params.id);
    if (!mapa) return res.status(404).json({ error: "Mapa no encontrado" });
    res.status(200).json({ message: "Mapa borrado exitosamente" });
  } catch (err) {
    console.error("Error al eliminar mapa:", err);
    res.status(500).json({ error: "Ocurrió un error al eliminar el mapa" });
  }
};