import express from "express";
import { createUser, getUser, loginUser, logOut } from "../controllers/authController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/users", protect, getUser);
router.get("/users", logOut);


export default router;