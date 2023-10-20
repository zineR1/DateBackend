import { Router } from 'express';
import { getTickets} from '../controllers/tickets.js';

const router = Router();

router.get('/init-insta', getTickets);


export default router;