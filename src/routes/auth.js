import { Router } from "express";
import {
  createUser,
  login,
  logout,
  resetPassword,
  createUserSiglo21,
} from "../controllers/users.js";

const router = Router();
const currentDate = new Date();
//Fecha límite (el 19 de octubre a las 23:59:59)
const deadlineDate = new Date("2024-10-19T23:59:59");

router.post(
  "/register",
  currentDate <= deadlineDate ? createUserSiglo21 : createUser
);
router.post("/login", login);
router.post("/logout", logout);
router.post("/reset", resetPassword);

export default router;
