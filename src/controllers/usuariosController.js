import Usuario from "../models/Usuario.js";
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

// Crear un nuevo usuario
export const createUsuario = async (req, res) => {
  req.body.fechaRegistro = obtenerFecha() + " - " + obtenerHora();
  req.body.ultimaActividad = obtenerFecha() + " - " + obtenerHora();

  try {
    const usuario = new Usuario(req.body);
    await usuario.save();
    res.status(201).json(usuario);
  } catch (err) {
    console.error("Error al crear usuario:", err);
    res.status(500).json({ error: "Ocurrió un error al crear el usuario" });
  }
};

// Obtener todos los usuarios
export const getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (err) {
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ error: "Ocurrió un error al obtener los usuarios" });
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
    res.status(200).json(usuario);
  } catch (err) {
    console.error("Error al obtener usuario por ID:", err);
    res.status(500).json({ error: "Ocurrió un error al obtener el usuario" });
  }
};

// Actualizar un usuario
export const updateUsuario = async (req, res) => {
  req.body.ultimaActividad = obtenerFecha() + " - " + obtenerHora();

  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    const usuarioActualizado = await Usuario.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(usuarioActualizado);
  } catch (err) {
    console.error("Error al actualizar usuario:", err);
    res.status(500).json({ error: "Ocurrió un error al actualizar el usuario" });
  }
};

// Eliminar un usuario
export const deleteUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });

    // Actualizar el campo "activo" a false
    usuario.activo = false;
    await usuario.save();

    res.status(200).json({ message: "Usuario desactivado correctamente" });
  } catch (err) {
    console.error("Error al desactivar usuario:", err);
    res.status(500).json({ error: "Ocurrió un error al desactivar el usuario" });
  }
};