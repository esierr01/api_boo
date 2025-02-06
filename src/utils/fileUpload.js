import multer from "multer";
import path from "path";
import fs from "fs";

// Configuración de multer para subir archivos temporalmente
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "./uploads"; // Carpeta temporal para archivos
    fs.mkdirSync(dir, { recursive: true }); // Crear la carpeta si no existe
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para el archivo
  },
});

const upload = multer({ storage });

// Función para eliminar archivos locales
export const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    }
  });
};

export default upload;
