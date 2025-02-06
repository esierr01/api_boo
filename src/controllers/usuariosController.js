import Usuario from "../models/Usuario.js";
import { deleteFile } from "../utils/fileUpload.js";
import {
  uploadFileToFilestack,
  deleteFileFromLocal,
} from "../utils/filestack.js";
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

const zonaHorariaVenezuela = "America/Caracas";

export const createUsuario = async (req, res) => {
  req.body.fechaRegistro = obtenerFecha() + " - " + obtenerHora();
  req.body.ultimaActividad = obtenerFecha() + " - " + obtenerHora();
  try {
    if (req.file) {
      const fileUrl = await uploadFileToFilestack(req.file.path);
      req.body.urlFotoPerfil = fileUrl;
      deleteFileFromLocal(req.file.path);
    }

    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateUsuario = async (req, res) => {
  req.body.ultimaActividad = obtenerFecha() + " - " + obtenerHora();
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Si se sube una nueva foto de perfil
    if (req.file) {
      const newFileUrl = await uploadFileToFilestack(req.file.path);
      req.body.urlFotoPerfil = newFileUrl; // Asignar la nueva URL
      deleteFileFromLocal(req.file.path);

      // Eliminar la foto de perfil antigua de Filestack (si existe)
      if (usuario.urlFotoPerfil) {
        // Aquí puedes agregar lógica para eliminar el archivo de Filestack si es necesario
      }
    }

    // Actualizar el usuario
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(usuarioActualizado);
  } catch (err) {
    if (req.file) {
      deleteFile(req.file.path);
    }
    res.status(400).json({ error: err.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Eliminar la foto de perfil de Filestack (si existe)
    if (usuario.urlFotoPerfil) {
      // Aquí puedes agregar lógica para eliminar el archivo de Filestack si es necesario
    }

    res.status(200).json({ message: "Usuario borrado satisfactoriamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
