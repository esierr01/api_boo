import mongoose from "mongoose";

const UsuarioSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rol: { type: String, required: true },
    urlFotoPerfil: { type: String, required: false },
    fechaRegistro: { type: String },
    ultimaActividad: { type: String },
    activo: { type: Boolean, default: true },
  },
  {
    versionKey: false, // Desactiva el campo __v
  }
);

export default mongoose.model("Usuario", UsuarioSchema);
