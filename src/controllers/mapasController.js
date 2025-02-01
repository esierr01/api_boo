import Mapa from "../models/Mapa.js";
import Usuario from "../models/Usuario.js";
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

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
    res.status(400).json({ error: err.message });
  }
};

export const getMapas = async (req, res) => {
  try {
    const mapas = await Mapa.find();
    res.status(200).json(mapas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMapaById = async (req, res) => {
  try {
    const mapa = await Mapa.findById(req.params.id);
    if (!mapa) return res.status(404).json({ error: "Mapa no encontrado" });
    res.status(200).json(mapa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateMapa = async (req, res) => {
  try {
    const mapa = await Mapa.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!mapa) return res.status(404).json({ error: "Mapa no encontrado" });
    res.status(200).json(mapa);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMapa = async (req, res) => {
  try {
    const mapa = await Mapa.findByIdAndDelete(req.params.id);
    if (!mapa) return res.status(404).json({ error: "Mapa no encontrado" });
    res.status(200).json({ message: "Mapa borrado exitosamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
