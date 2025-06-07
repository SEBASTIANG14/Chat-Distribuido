// backend/socket.js
const Message = require("./models/Message");

function initSocket(io) {
  io.on("connection", (socket) => {
    console.log("🟢 Usuario conectado:", socket.id);

    socket.on("chat message", async (msg) => {
      const newMsg = await Message.create(msg);
      io.emit("chat message", newMsg);
    });

    socket.on("disconnect", () => {
      console.log("🔴 Usuario desconectado:", socket.id);
    });
  });
}

module.exports = initSocket;
