// backend/server.js
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./db");
const User = require("./models/User");
const Message = require("./models/Message");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Chat backend corriendo");
});

// API para registrar usuario (sin auth por simplicidad)
app.post("/register", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "username es requerido" });

  try {
    const user = await User.findOneAndUpdate(
      { username },
      { username },
      { upsert: true, new: true }
    );
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Error registrando usuario" });
  }
});

// WebSocket
io.on("connection", (socket) => {
  console.log("📡 Cliente conectado");

  socket.on("join", async ({ username, room }) => {
    socket.join(room);
    console.log(`${username} se unió a la sala ${room}`);

    // enviar historial de mensajes
    const messages = await Message.find({ room }).sort({ timestamp: 1 });
    socket.emit("history", messages);
  });

  socket.on("message", async ({ room, username, content }) => {
    const msg = new Message({ room, sender: username, content });
    await msg.save();
    io.to(room).emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log("🔌 Cliente desconectado");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
