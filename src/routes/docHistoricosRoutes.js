import express from 'express';
import { createDocHistorico, getDocHistoricos, getDocHistoricoById, updateDocHistorico, deleteDocHistorico } from '../controllers/docHistoricosController.js';

const router = express.Router();

router.post('/', createDocHistorico);
router.get('/', getDocHistoricos);
router.get('/:id', getDocHistoricoById);
router.put('/:id', updateDocHistorico);
router.delete('/:id', deleteDocHistorico);

export default router;