import express from "express";
import { register, login, allUsers } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", protect, allUsers);

export default router;