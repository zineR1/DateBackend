import { Router } from 'express';
import {
    getComprobantes,
    getComprobanteById,
    createComprobante,
    deleteComprobante,
    upload
} from '../controllers/receipts.js';

const router = Router();

router.get('/comprobantes', getComprobantes);
router.get('/evento/:eventId/comprobantes/:userId', getComprobanteById);
router.post('/comprobantes/:eventId/uploadComprobante/:userId', upload.single('file'), createComprobante);
router.delete('/comprobantes/:eventId/deleteComprobante/:userId/:posicion', deleteComprobante);

export default router;
