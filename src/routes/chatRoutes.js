import express from "express";
import {
    accessChat,
    fetchChats,
    createGroup,
    setDisappearingMessages, // 👈 NEW
} from "../controllers/chatController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, accessChat);
router.get("/", protect, fetchChats);
router.post("/group", protect, createGroup);
router.put("/disappearing/:chatId", protect, setDisappearingMessages); // 👈 NEW

export default router;