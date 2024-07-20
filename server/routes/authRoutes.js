import express from "express";
import * as authController from "../controllers/authController.js";
import { validateRegister } from "../middleware/validation.js";

const router = express.Router();

router.post("/register", validateRegister, authController.createUser);

export default router;
