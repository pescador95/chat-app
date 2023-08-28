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
  console.log(socket.id);
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log(msg);
    io.emit("chat message", msg);
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
