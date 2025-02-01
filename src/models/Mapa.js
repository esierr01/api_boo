import mongoose from "mongoose";

const MapaSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    ubiNombre: { type: String, required: true },
    ubiLatitud: { type: Number, required: true },
    ubiLongitud: { type: Number, required: true },
    idUsuario: { type: String, required: true },
    fechaCreacion: { type: String },
  },
  {
    versionKey: false, // Desactiva el campo __v
  }
);

export default mongoose.model("Mapa", MapaSchema);
