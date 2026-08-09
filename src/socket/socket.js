const socketHandler = (io) => {
  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    socket.on("setup", (userId) => {
      onlineUsers.set(userId, socket.id);
      socket.join(userId);
      io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    socket.on("join-chat", (chatId) => socket.join(chatId));
    socket.on("typing", (chatId) => socket.in(chatId).emit("typing"));
    socket.on("stop-typing", (chatId) => socket.in(chatId).emit("stop-typing"));

    socket.on("new-message", (message) => {
      const chatId = message?.chat?._id;
      if (!chatId) return;
      socket.to(chatId.toString()).emit("message-received", message);
    });

    // 👇 NEW — jab koi user chat read kare, dusre ko batao
    socket.on("message-read", ({ chatId, userId }) => {
      socket.to(chatId).emit("messages-seen", { chatId, userId });
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