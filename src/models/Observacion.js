import mongoose from "mongoose";

const ObservacionSchema = new mongoose.Schema(
  {
    idUsuario: { type: String, required: true },
    idEvento: { type: String, required: true },
    mensaje: { type: String, required: true },
    fechaEnvio: { type: String },
    mensaRespondido: { type: Boolean, default: false },
    respuesta: { type: String },
    idUsuarRespuesta: { type: String },
    fechaRespuesta: { type: String },
  },
  {
    versionKey: false, // Desactiva el campo __v
  }
);

export default mongoose.model("Observacion", ObservacionSchema);
