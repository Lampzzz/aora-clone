import express from "express";
import * as authController from "../controllers/authController.js";
import { validateLogin, validateRegister } from "../middleware/validation.js";

const router = express.Router();

router.post("/register", validateRegister, authController.createUser);
router.post("/login", validateLogin, authController.loginUser);

export default router;
