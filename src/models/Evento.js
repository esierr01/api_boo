import mongoose from "mongoose";

const EventoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    ubicacion: { type: String, required: true },
    mitoLeyenda: { type: Boolean, required: true },
    urlImagen: { type: String, required: true },
    urlVideo: { type: String, required: true },
    idUsuario: { type: String, required: true },
    fechaCreacion: { type: String },
    estrellas: { type: Number, default: 1 },
    popularidad: { type: Number, default: 1 },
    activo: { type: Boolean, default: true },
    revisionAprobado: { type: Boolean, default: false },
    mensajeAproba: { type: String },
    fechaAproba: { type: String },
  },
  {
    versionKey: false, // Desactiva el campo __v
  }
);

export default mongoose.model("Evento", EventoSchema);
