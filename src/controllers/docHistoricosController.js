import DocHistorico from "../models/DocHistorico.js";
import Usuario from "../models/Usuario.js";
import { deleteFile } from "../utils/fileUpload.js";
import {
  uploadFileToFilestack,
  deleteFileFromLocal,
} from "../utils/filestack.js";
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

export const createDocHistorico = async (req, res) => {
  req.body.fechaCarga = obtenerFecha() + " - " + obtenerHora();

  try {
    const usuarioExistente = await Usuario.findById(req.body.idUsuario);
    if (!usuarioExistente) {
      if (req.file) {
        deleteFile(req.file.path);
      }
      return res.status(400).json({ error: "El usuario no existe" });
    }

    if (!req.file) {
      return res.status(400).json({ error: "Debe subir un archivo PDF" });
    }

    const fileUrl = await uploadFileToFilestack(req.file.path);
    req.body.urlDocumento = fileUrl;
    deleteFileFromLocal(req.file.path);

    const docHistorico = new DocHistorico(req.body);
    await docHistorico.save();
    res.status(201).json(docHistorico);
  } catch (err) {
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

    // Si se sube un nuevo archivo
    if (req.file) {
      const newFileUrl = await uploadFileToFilestack(req.file.path);
      req.body.urlDocumento = newFileUrl; // Asignar la nueva URL
      deleteFileFromLocal(req.file.path);

      // Eliminar el archivo antiguo de Filestack (si existe)
      if (docHistorico.urlDocumento) {
        // Aquí puedes agregar lógica para eliminar el archivo de Filestack si es necesario
      }
    }

    // Actualizar el documento histórico
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

    // Eliminar el archivo de Filestack (si existe)
    if (docHistorico.urlDocumento) {
      // Aquí puedes agregar lógica para eliminar el archivo de Filestack si es necesario
    }

    res
      .status(200)
      .json({ message: "Documento histórico eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
