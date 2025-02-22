import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import eventosRoutes from "./routes/eventosRoutes.js";
import usuariosRoutes from "./routes/usuariosRoutes.js";
import docHistoricosRoutes from "./routes/docHistoricosRoutes.js";
import mapasRoutes from "./routes/mapasRoutes.js";
import observacionesRoutes from "./routes/observacionesRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para form-data

// Conexión a MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Conectado a MongoDB Atlas"))
  .catch((err) => {
    console.error("No se pudo conectar a MongoDB Atlas:", err.message);
    process.exit(1);
  });

// Endpoint de verificación de la API
app.get("/", (req, res) => {
  res.status(200).json({ message: "API de Boo-App Activa" });
});

// Rutas
app.use("/api/eventos", eventosRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/doc-historicos", docHistoricosRoutes);
app.use("/api/mapas", mapasRoutes);
app.use("/api/observaciones", observacionesRoutes);

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
