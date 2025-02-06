import filestack from "filestack-js";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const client = filestack.init(process.env.FILESTACK_API_KEY);

// Función para subir un archivo a Filestack
export const uploadFileToFilestack = async (filePath) => {
  try {
    const response = await client.upload(filePath);
    return response.url; // Retorna la URL del archivo subido
  } catch (error) {
    console.error("Error uploading file to Filestack:", error);
    throw error;
  }
};

// Función para eliminar un archivo local
export const deleteFileFromLocal = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
    }
  });
};
