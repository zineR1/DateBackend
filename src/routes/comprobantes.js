import { Router } from 'express';
import {
    getComprobantes,
    getComprobanteById,
    createComprobante,
    upload
} from '../controllers/comprobantes.js';

const router = Router();

router.get('/comprobantes', getComprobantes);
router.get('/comprobantes/:id', getComprobanteById);
router.post('/comprobantes/:eventId/uploadComprobante/:userId', upload.single('file'), createComprobante);

export default router;
