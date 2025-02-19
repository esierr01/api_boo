import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import eventosRoutes from "./routes/eventosRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import docHistoricosRoutes from "./routes/docHistoricosRoutes.js";
import mapasRoutes from "./routes/mapasRoutes.js";
import observacionesRoutes from "./routes/observacionesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar Express para servir archivos estáticos desde el directorio "uploads"
// Si ya no usas la carpeta "uploads", puedes eliminar o comentar esta línea
// const __dirname = path.resolve();
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para form-data

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Could not connect to MongoDB Atlas", err));

app.use("/api/eventos", eventosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/doc-historicos", docHistoricosRoutes);
app.use("/api/mapas", mapasRoutes);
app.use("/api/observaciones", observacionesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
