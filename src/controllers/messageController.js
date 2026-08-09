import Message from "../models/Message.js";
import Chat from "../models/Chat.js";

export const sendMessage = async (req, res) => {
  const { content, chatId, fileUrl } = req.body;
  let msg = await Message.create({ sender: req.user._id, content, chat: chatId, fileUrl, readBy: [req.user._id], });
  msg = await msg.populate("sender", "name email");
  msg = await msg.populate({ path: "chat", populate: { path: "users", select: "name email" } });
  await Chat.findByIdAndUpdate(chatId, { latestMessage: msg });
  res.json(msg);
};

export const getMessages = async (req, res) => {
  const messages = await Message.find({ chat: req.params.chatId })
    .populate("sender", "name email")
    .populate("chat");
  res.json(messages);
};

export const markAsRead = async (req, res) => {
  const { chatId } = req.params;
  await Message.updateMany(
    { chat: chatId, readBy: { $ne: req.user._id } },
    { $addToSet: { readBy: req.user._id } }
  );
  res.json({ success: true });
};