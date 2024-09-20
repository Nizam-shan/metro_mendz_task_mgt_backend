import { Router } from "express";
import { login, userRegistration } from "../controllers/authController.js";
import upload from "../middleware/upload.js";
const router = Router();

router.post("/login", login);
router.post("/register", upload.single("profile_image"), userRegistration);

export default router;
