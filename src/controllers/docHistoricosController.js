import DocHistorico from "../models/DocHistorico.js";
import Usuario from "../models/Usuario.js"; // Importar el modelo de Usuario
import { deleteFile } from "../utils/fileUpload.js";
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

export const createDocHistorico = async (req, res) => {
  req.body.fechaCarga = obtenerFecha() + " - " + obtenerHora();

  try {
    // Verificar si el idUsuario existe en la colección de usuarios
    const usuarioExistente = await Usuario.findById(req.body.idUsuario);
    if (!usuarioExistente) {
      // Eliminar el archivo subido si el usuario no existe
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({ error: "El usuario no existe" });
    }

    // Verificar si se subió un archivo
    if (!req.file) {
      return res.status(400).json({ error: "Debe subir un archivo PDF" });
    }

    // Asignar la ruta del archivo subido
    req.body.urlDocumento = req.file.path;

    // Crear y guardar el documento histórico
    const docHistorico = new DocHistorico(req.body);
    await docHistorico.save();
    res.status(201).json(docHistorico);
  } catch (err) {
    // Eliminar el archivo subido si ocurre un error
    if (req.file) {
      deleteFile(req.file.path);
    }
    res.status(400).json({ error: err.message });
  }
};

export const getDocHistoricos = async (req, res) => {
  try {
    const docHistoricos = await DocHistorico.find();
    res.status(200).json(docHistoricos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getDocHistoricoById = async (req, res) => {
  try {
    const docHistorico = await DocHistorico.findById(req.params.id);
    if (!docHistorico)
      return res.status(404).json({ error: "DocHistorico not found" });
    res.status(200).json(docHistorico);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateDocHistorico = async (req, res) => {
  try {
    const docHistorico = await DocHistorico.findById(req.params.id);
    if (!docHistorico) {
      return res
        .status(404)
        .json({ error: "Documento histórico no encontrado" });
    }

    // Si se sube un nuevo archivo, eliminar el archivo anterior
    if (req.file) {
      if (docHistorico.urlDocumento) {
        deleteFile(docHistorico.urlDocumento); // Eliminar el archivo anterior
      }
      req.body.urlDocumento = req.file.path; // Asignar la ruta del nuevo archivo
    }

    // Actualizar el documento histórico
    const docHistoricoActualizado = await DocHistorico.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(docHistoricoActualizado);
  } catch (err) {
    // Eliminar el archivo subido si ocurre un error
    if (req.file) {
      deleteFile(req.file.path);
    }
    res.status(400).json({ error: err.message });
  }
};

export const deleteDocHistorico = async (req, res) => {
  try {
    const docHistorico = await DocHistorico.findByIdAndDelete(req.params.id);
    if (!docHistorico) {
      return res
        .status(404)
        .json({ error: "Documento histórico no encontrado" });
    }

    // Eliminar el archivo asociado
    if (docHistorico.urlDocumento) {
      deleteFile(docHistorico.urlDocumento);
    }

    res
      .status(200)
      .json({ message: "Documento histórico eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
