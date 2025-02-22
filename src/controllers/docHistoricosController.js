import DocHistorico from "../models/DocHistorico.js";
import Usuario from "../models/Usuario.js";
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

// Crear un nuevo documento histórico
export const createDocHistorico = async (req, res) => {
  req.body.fechaCarga = obtenerFecha() + " - " + obtenerHora();

  try {
    const usuarioExistente = await Usuario.findById(req.body.idUsuario);
    if (!usuarioExistente) {
      return res.status(400).json({ error: "El usuario no existe" });
    }

    const docHistorico = new DocHistorico(req.body);
    await docHistorico.save();
    res.status(201).json(docHistorico);
  } catch (err) {
    console.error("Error al crear documento histórico:", err);
    res.status(500).json({ error: "Ocurrió un error al crear el documento histórico" });
  }
};

// Obtener todos los documentos históricos
export const getDocHistoricos = async (req, res) => {
  try {
    const docHistoricos = await DocHistorico.find();
    res.status(200).json(docHistoricos);
  } catch (err) {
    console.error("Error al obtener documentos históricos:", err);
    res.status(500).json({ error: "Ocurrió un error al obtener los documentos históricos" });
  }
};

// Obtener un documento histórico por ID
export const getDocHistoricoById = async (req, res) => {
  try {
    const docHistorico = await DocHistorico.findById(req.params.id);
    if (!docHistorico) {
      return res.status(404).json({ error: "Documento histórico no encontrado" });
    }
    res.status(200).json(docHistorico);
  } catch (err) {
    console.error("Error al obtener documento histórico por ID:", err);
    res.status(500).json({ error: "Ocurrió un error al obtener el documento histórico" });
  }
};

// Actualizar un documento histórico
export const updateDocHistorico = async (req, res) => {
  try {
    const docHistorico = await DocHistorico.findById(req.params.id);
    if (!docHistorico) {
      return res.status(404).json({ error: "Documento histórico no encontrado" });
    }

    const docHistoricoActualizado = await DocHistorico.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(docHistoricoActualizado);
  } catch (err) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    console.error("Error al actualizar documento histórico:", err);
    res.status(500).json({ error: "Ocurrió un error al actualizar el documento histórico" });
  }
};

// Eliminar un documento histórico
export const deleteDocHistorico = async (req, res) => {
  try {
    const docHistorico = await DocHistorico.findByIdAndDelete(req.params.id);
    if (!docHistorico) {
      return res.status(404).json({ error: "Documento histórico no encontrado" });
    }
    res.status(200).json({ message: "Documento histórico eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar documento histórico:", err);
    res.status(500).json({ error: "Ocurrió un error al eliminar el documento histórico" });
  }
};