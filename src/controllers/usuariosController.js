import Usuario from "../models/Usuario.js";
import { deleteFile } from "../utils/fileUpload.js";
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

const zonaHorariaVenezuela = "America/Caracas";

export const createUsuario = async (req, res) => {
  req.body.fechaRegistro = obtenerFecha() + " - " + obtenerHora();
  req.body.ultimaActividad = obtenerFecha() + " - " + obtenerHora();
  try {
    if (req.file) {
      req.body.urlFotoPerfil = req.file.path; // Asignar la ruta de la foto subida
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

    // Si se sube una nueva foto, eliminar la foto anterior
    if (req.file) {
      if (usuario.urlFotoPerfil) {
        deleteFile(usuario.urlFotoPerfil); // Eliminar la foto anterior
      }
      req.body.urlFotoPerfil = req.file.path; // Asignar la ruta de la nueva foto
    }

    // Actualizar el usuario
    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(usuarioActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario)
      return res.status(404).json({ error: "Usuario no encontrado" });

    // Eliminar la foto de perfil si existe
    if (usuario.urlFotoPerfil) {
      deleteFile(usuario.urlFotoPerfil);
    }

    res.status(200).json({ message: "Usuario borrado satisfactoriamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
