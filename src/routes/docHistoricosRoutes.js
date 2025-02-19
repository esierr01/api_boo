import express from 'express';
import { createDocHistorico, getDocHistoricos, getDocHistoricoById, updateDocHistorico, deleteDocHistorico } from '../controllers/docHistoricosController.js';
import upload from '../utils/fileUpload.js';

const router = express.Router();

router.post('/', upload.single('urlDocumento'), createDocHistorico);
router.get('/', getDocHistoricos);
router.get('/:id', getDocHistoricoById);
router.put('/:id', upload.single('urlDocumento'), updateDocHistorico);
router.delete('/:id', deleteDocHistorico);

export default router;