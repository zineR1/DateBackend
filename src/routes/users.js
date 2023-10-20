import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser, correoReset} from '../controllers/users.js'

const router = Router();

router.get('/users', getUsers);
router.get('/users/mail', correoReset);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/users/:id', getUserById);


export default router;