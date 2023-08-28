const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const ngrok = require("ngrok");
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/chat", (req, res) => {
  const nickname = req.query.nickname;
  res.sendFile(__dirname + "/public/chat.html");
});

io.on("connection", (socket) => {
  let userRoom;

  socket.on("joinRoom", (room, nickname) => {
    socket.join(room);
    userRoom = room;
    socket.nickname = nickname;

    const entryMessage = `${nickname} entrou na sala ${room}`;
    io.to(room).emit("userEntered", entryMessage);
  });

  socket.on("disconnect", () => {
    if (userRoom) {
      const exitMessage = `${socket.nickname || "Um usuário"} saiu da sala`;
      io.to(userRoom).emit("userExited", exitMessage);
    }
  });

  socket.on("chat message", (msg) => {
    io.to(msg.room).emit("chat message", msg);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

  ngrok
    .connect(3000)
    .then((url) => {
      console.log("Túnel ngrok disponível em:", url);
    })
    .catch((err) => {
      console.error("Erro ao iniciar o túnel ngrok:", err);
    });
});
