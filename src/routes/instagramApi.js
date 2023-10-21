import { Router } from 'express';
import { getFirstCode } from '../controllers/instagramApi.js';

const router = Router();

router.post('/init-insta', getFirstCode);


export default router;