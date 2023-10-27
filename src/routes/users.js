import { Router } from 'express';
import { getUsers, getUserById, updateUser, deleteUser, correoReset, uploadImages} from '../controllers/users.js'
import multer from 'multer';


const router = Router();



router.get('/users', getUsers);
router.post('/users/mail', correoReset);
router.post('/users/upload', uploadImages);

router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.get('/users/:id', getUserById);
router.put('/users/:id/events');




export default router;