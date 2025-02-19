import express from 'express';
import { createUsuario, getUsuarios, getUsuarioById, updateUsuario, deleteUsuario } from '../controllers/usuariosController.js';
import upload from '../utils/fileUpload.js';

const router = express.Router();

router.post('/', upload.single('urlFotoPerfil'), createUsuario);
router.get('/', getUsuarios);
router.get('/:id', getUsuarioById);
router.put('/:id', upload.single('urlFotoPerfil'), updateUsuario);
router.delete('/:id', deleteUsuario);

export default router;