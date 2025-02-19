import express from 'express';
import { createMapa, getMapas, getMapaById, updateMapa, deleteMapa } from '../controllers/mapasController.js';

const router = express.Router();

router.post('/', createMapa);
router.get('/', getMapas);
router.get('/:id', getMapaById);
router.put('/:id', updateMapa);
router.delete('/:id', deleteMapa);

export default router;