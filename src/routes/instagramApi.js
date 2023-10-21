import { Router } from 'express';
import { getFirstCode } from '../controllers/instagramApi.js';

const router = Router();

router.get('/init-insta', getFirstCode);


export default router;