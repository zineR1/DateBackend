import { Router } from 'express';
import {
    getComprobantes,
    getComprobanteById,
    createComprobante,
    deleteComprobante,
    upload
} from '../controllers/comprobantes.js';

const router = Router();

router.get('/comprobantes', getComprobantes);
router.get('/comprobantes/:id', getComprobanteById);
router.post('/comprobantes/:eventId/uploadComprobante/:userId', upload.single('file'), createComprobante);
router.delete('/comprobantes/:eventId/deleteComprobante/:userId/:posicion', deleteComprobante);

export default router;
