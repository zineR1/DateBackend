import { Router } from "express";
import {
  getUsers,
  getUserById,
  getUserEvents,
  updateUser,
  updateNotificationToken,
  deleteUser,
  correoReset,
  upload,
  //uploadImage,
  deletePicture,
  updatePicture,
} from "../controllers/users.js";
import { createRandomGuestsForEvent } from "../controllers/createMultipleGuests/usersCreator/usersCreator.js";
const router = Router();

router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.get("/users/:userId/events", getUserEvents);
router.post("/users/mail", correoReset);
router.post(
  "/users/:id/upload/:posicion",
  upload.single("file"),
  updatePicture
);
//router.post('/users/:id/updateImage', upload.single('file', updatePicture))
router.put("/users/:id", updateUser);
router.put("/users/:id/updateNotificationToken", updateNotificationToken);
router.delete("/users/:id", deleteUser);
router.delete("/users/:id/deleteImage/:posicion", deletePicture);
// router.put("/users/:id/events");

//RUTA PARA CREAR MULTIPLES USUARIOS DE PRUEBA
router.post("/users/randomUsersCreator", createRandomGuestsForEvent);

export default router;
