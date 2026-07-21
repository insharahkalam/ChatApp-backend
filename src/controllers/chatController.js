import Chat from "../models/Chat.js";
import User from "../models/User.js";

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

export const fetchChats = async (req, res) => {
  const chats = await Chat.find({ users: req.user._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 });
  res.json(chats);
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