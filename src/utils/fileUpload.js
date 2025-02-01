import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir = '';
    if (file.fieldname === 'urlImagen') {
      dir = './uploads/img';
    } else if (file.fieldname === 'urlVideo') {
      dir = './uploads/vid';
    } else if (file.fieldname === 'urlDocumento') {
      dir = './uploads/doc';
    } else if (file.fieldname === 'urlFotoPerfil') {
      dir = './uploads/fotos';
    }
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

export const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
    }
  });
};

export default upload;