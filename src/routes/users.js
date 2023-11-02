import { Router } from 'express';
import { User } from '../models/User.js'
import { getUsers, 
         getUserById, 
         updateUser, 
         deleteUser, 
         correoReset, 
         upload, 
         //uploadImage, 
         deletePicture,
         updatePicture
        } from '../controllers/users.js'
import multer from 'multer';
import path from 'path';
import { where } from 'sequelize';

const router = Router();

router.get('/users', getUsers);
router.post('/users/mail', correoReset);
router.post('/users/:id/upload/:posicion', upload.single('file'), updatePicture);
//router.post('/users/:id/updateImage', upload.single('file', updatePicture))
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);
router.delete('/users/:id/deleteImage/:posicion', deletePicture)
router.get('/users/:id', getUserById);
router.put('/users/:id/events');




export default router;