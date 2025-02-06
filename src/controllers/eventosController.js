import Evento from "../models/Evento.js";
import Usuario from "../models/Usuario.js";
import { deleteFile } from "../utils/fileUpload.js";
import {
  uploadFileToFilestack,
  deleteFileFromLocal,
} from "../utils/filestack.js";
import { obtenerFecha, obtenerHora } from "../utils/fechaHora.js";

export const createEvento = async (req, res) => {
  req.body.fechaCreacion = obtenerFecha() + " - " + obtenerHora();

  try {
    const usuarioExistente = await Usuario.findById(req.body.idUsuario);
    if (!usuarioExistente) {
      if (req.files) {
        if (req.files.urlImagen) {
          deleteFile(req.files.urlImagen[0].path);
        }
        if (req.files.urlVideo) {
          deleteFile(req.files.urlVideo[0].path);
        }
      }
      return res.status(400).json({ error: "El usuario no existe" });
    }

    if (req.files) {
      if (req.files.urlImagen) {
        const imageUrl = await uploadFileToFilestack(
          req.files.urlImagen[0].path
        );
        req.body.urlImagen = imageUrl;
        deleteFileFromLocal(req.files.urlImagen[0].path);
      }
      if (req.files.urlVideo) {
        const videoUrl = await uploadFileToFilestack(
          req.files.urlVideo[0].path
        );
        req.body.urlVideo = videoUrl;
        deleteFileFromLocal(req.files.urlVideo[0].path);
      }
    }

    const evento = new Evento(req.body);
    await evento.save();
    res.status(201).json(evento);
  } catch (err) {
    if (req.files) {
      if (req.files.urlImagen) {
        deleteFile(req.files.urlImagen[0].path);
      }
      if (req.files.urlVideo) {
        deleteFile(req.files.urlVideo[0].path);
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

    // Si se sube un nuevo archivo de imagen
    if (req.files && req.files.urlImagen) {
      const newImageUrl = await uploadFileToFilestack(
        req.files.urlImagen[0].path
      );
      req.body.urlImagen = newImageUrl; // Asignar la nueva URL
      deleteFileFromLocal(req.files.urlImagen[0].path);

      // Eliminar la imagen antigua de Filestack (si existe)
      if (evento.urlImagen) {
        // Aquí puedes agregar lógica para eliminar el archivo de Filestack si es necesario
      }
    }

    // Si se sube un nuevo archivo de video
    if (req.files && req.files.urlVideo) {
      const newVideoUrl = await uploadFileToFilestack(
        req.files.urlVideo[0].path
      );
      req.body.urlVideo = newVideoUrl; // Asignar la nueva URL
      deleteFileFromLocal(req.files.urlVideo[0].path);

      // Eliminar el video antiguo de Filestack (si existe)
      if (evento.urlVideo) {
        // Aquí puedes agregar lógica para eliminar el archivo de Filestack si es necesario
      }
    }

    const eventoActualizado = await Evento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(eventoActualizado);
  } catch (err) {
    if (req.files) {
      if (req.files.urlImagen) {
        deleteFile(req.files.urlImagen[0].path);
      }
      if (req.files.urlVideo) {
        deleteFile(req.files.urlVideo[0].path);
      }
    }
    res.status(400).json({ error: err.message });
  }
};

export const deleteEvento = async (req, res) => {
  try {
    const evento = await Evento.findByIdAndDelete(req.params.id);
    if (!evento) return res.status(404).json({ error: "Evento no encontrado" });

    // Eliminar la imagen de Filestack (si existe)
    if (evento.urlImagen) {
      // Aquí puedes agregar lógica para eliminar el archivo de Filestack si es necesario
    }

    // Eliminar el video de Filestack (si existe)
    if (evento.urlVideo) {
      // Aquí puedes agregar lógica para eliminar el archivo de Filestack si es necesario
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
    evento.activo = revisionAprobado;

    // Guardar los cambios en la base de datos
    await evento.save();

    // Devolver el evento actualizado
    res.status(200).json(evento);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
