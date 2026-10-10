import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    fileUrl: { type: String, default: "" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    // 👇 NEW
    disappearing: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// 👇 NEW — TTL index: jab expiresAt time aa jaye, MongoDB khud document delete kar dega
// expireAfterSeconds: 0 ka matlab hai "expiresAt field mein jo exact date di hai usi waqt delete karo"
messageSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("Message", messageSchema);