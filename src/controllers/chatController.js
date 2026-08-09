import Chat from "../models/Chat.js";
import User from "../models/User.js";
import Message from "../models/Message.js"; // 👈 import add karo

export const accessChat = async (req, res) => {
  const { userId } = req.body;
  let chat = await Chat.findOne({
    isGroupChat: false,
    users: { $all: [req.user._id, userId] },
  }).populate("users", "-password").populate("latestMessage");

  if (chat) return res.json(chat);

  const newChat = await Chat.create({
    chatName: "sender",
    isGroupChat: false,
    users: [req.user._id, userId],
  });
  const full = await Chat.findById(newChat._id).populate("users", "-password");
  res.json(full);
};

// 👇 UPDATED — har chat ke saath unreadCount bhi bhejo
export const fetchChats = async (req, res) => {
  const chats = await Chat.find({ users: req.user._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });

  const chatsWithUnread = await Promise.all(
    chats.map(async (chat) => {
      const unreadCount = await Message.countDocuments({
        chat: chat._id,
        sender: { $ne: req.user._id },
        readBy: { $ne: req.user._id },
      });
      return { ...chat.toObject(), unreadCount };
    })
  );

  res.json(chatsWithUnread);
};

export const createGroup = async (req, res) => {
  const { name, users } = req.body;
  const group = await Chat.create({
    chatName: name,
    users: [...users, req.user._id],
    isGroupChat: true,
    groupAdmin: req.user._id,
  });
  const full = await Chat.findById(group._id).populate("users", "-password").populate("groupAdmin", "-password");
  res.json(full);
};