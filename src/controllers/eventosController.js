import Evento from "../models/Evento.js";
import Usuario from "../models/Usuario.js"; // Importar el modelo de Usuario
import { deleteFile } from "../utils/fileUpload.js";
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

export const createEvento = async (req, res) => {
  req.body.fechaCreacion = obtenerFecha() + " - " + obtenerHora();

  try {
    // Verificar si el idUsuario existe en la colección de usuarios
    const usuarioExistente = await Usuario.findById(req.body.idUsuario);
    if (!usuarioExistente) {
      // Eliminar archivos subidos si el usuario no existe
      if (req.files) {
        if (req.files.urlImagen) {
          deleteFile(req.files.urlImagen[0].path); // Eliminar la imagen subida
        }
        if (req.files.urlVideo) {
          deleteFile(req.files.urlVideo[0].path); // Eliminar el video subido
        }
      }
      return res.status(400).json({ error: "El usuario no existe" });
    }

    // Asignar las rutas de los archivos subidos (si existen)
    if (req.files) {
      if (req.files.urlImagen) {
        req.body.urlImagen = req.files.urlImagen[0].path; // Asignar la ruta de la imagen
      }
      if (req.files.urlVideo) {
        req.body.urlVideo = req.files.urlVideo[0].path; // Asignar la ruta del video
      }
    }

    // Crear y guardar el evento
    const evento = new Evento(req.body);
    await evento.save();
    res.status(201).json(evento);
  } catch (err) {
    // Eliminar archivos subidos si ocurre un error
    if (req.files) {
      if (req.files.urlImagen) {
        deleteFile(req.files.urlImagen[0].path); // Eliminar la imagen subida
      }
      if (req.files.urlVideo) {
        deleteFile(req.files.urlVideo[0].path); // Eliminar el video subido
      }
    }
    res.status(400).json({ error: err.message });
  }
};

export const getEventos = async (req, res) => {
  try {
    const eventos = await Evento.find();
    res.status(200).json(eventos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getEventoById = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento not found" });
    res.status(200).json(evento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateEvento = async (req, res) => {
  try {
    const evento = await Evento.findById(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    // Eliminar archivos antiguos si se suben nuevos
    if (req.files) {
      if (req.files.urlImagen) {
        if (evento.urlImagen) {
          deleteFile(evento.urlImagen); // Eliminar la imagen anterior
        }
        req.body.urlImagen = req.files.urlImagen[0].path; // Asignar la nueva imagen
      }
      if (req.files.urlVideo) {
        if (evento.urlVideo) {
          deleteFile(evento.urlVideo); // Eliminar el video anterior
        }
        req.body.urlVideo = req.files.urlVideo[0].path; // Asignar el nuevo video
      }
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(eventoActualizado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteEvento = async (req, res) => {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    // Eliminar archivos asociados (imagen y video)
    if (evento.urlImagen) {
      deleteFile(evento.urlImagen);
    }
    if (evento.urlVideo) {
      deleteFile(evento.urlVideo);
    }

    res.status(200).json({ message: "Evento eliminado correctamente" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const aprobarRechazarEvento = async (req, res) => {
  try {
    const { mensajeAproba, revisionAprobado } = req.body;

    // Validar que se proporcionen los campos requeridos
    if (mensajeAproba === undefined || revisionAprobado === undefined) {
      return res.status(400).json({
        error:
          "Debe suministrar un mensaje de aprobacion y el resultado de la revisión",
      });
    }

    // Obtener el evento por su ID
    const evento = await Evento.findById(req.params.id);
    if (!evento) {
      return res.status(404).json({ error: "Evento no encontrado" });
    }

    // Actualizar los campos según la decisión de aprobación o rechazo
    evento.mensajeAproba = mensajeAproba;
    evento.fechaAproba = obtenerFecha() + " - " + obtenerHora(); // Fecha y hora actual
    evento.revisionAprobado = revisionAprobado;

    // Si el evento no es aprobado, mantener activo = false
    if (!revisionAprobado) {
      evento.activo = false;
    } else {
      // Si el evento es aprobado, establecer activo = true
      evento.activo = true;
    }

    // Guardar los cambios en la base de datos
    await evento.save();

    // Devolver el evento actualizado
    res.status(200).json(evento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
