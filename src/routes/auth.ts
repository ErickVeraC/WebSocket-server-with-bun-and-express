import { Router } from "express";
import * as yup from "yup";
import { validateBody } from "../middleware/validate";
import { register, login } from "../controllers/authController";
import { password } from "bun";

const router = Router();

const registerSchema = yup.object({
  name: yup.string().required(),
  email: yup.string().email().required(),
  password: yup.string().min(6).required(),
});

const loginSchema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().required(),
});

router.post("/register", validateBody(registerSchema), register);
router.post("/login", validateBody(loginSchema), login);

export default router;
