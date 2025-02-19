import mongoose from "mongoose";

const DocHistoricoSchema = new mongoose.Schema(
  {
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    fechaCarga: { type: String },
    urlDocumento: { type: String, required: true },
    idUsuario: { type: String, required: true },
  },
  {
    versionKey: false, // Desactiva el campo __v
  }
);

export default mongoose.model("DocHistorico", DocHistoricoSchema);
