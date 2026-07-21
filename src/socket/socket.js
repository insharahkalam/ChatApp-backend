const socketHandler = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    socket.on("setup", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    socket.on("join-chat", (chatId) => socket.join(chatId));
    socket.on("typing", (chatId) => socket.in(chatId).emit("typing"));
    socket.on("stop-typing", (chatId) => socket.in(chatId).emit("stop-typing"));

    socket.on("new-message", (message) => {
      const chat = message.chat;
      if (!chat.users) return;
      chat.users.forEach((u) => {
        if (u._id === message.sender._id) return;
        socket.in(u._id).emit("message-received", message);
      });
    });

    socket.on("disconnect", () => {
      for (const [uid, sid] of onlineUsers.entries()) {
        if (sid === socket.id) onlineUsers.delete(uid);
      }
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });
  });
};

export default socketHandler;