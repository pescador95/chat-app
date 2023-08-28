document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const urlParams = new URLSearchParams(window.location.search);
  const nickname = urlParams.get("nickname");
  const roomName = urlParams.get("room");

  const messagesContainer = document.getElementById("messages");
  const messageInput = document.getElementById("message-input");
  const sendButton = document.getElementById("send-button");
  const roomNameValue = document.getElementById("room-name-value");
  const nicknameDisplay = document.getElementById("nickname-display");
  roomNameValue.textContent = `Sala: ${roomName}`;

  nicknameDisplay.textContent = `Seu Nickname: ${nickname}`;

  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const message = messageInput.value.trim();
      if (message && nickname) {
        socket.emit("chat message", { nickname, message });
        messageInput.value = "";
      }
    }
  });

  sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    if (message && nickname) {
      socket.emit("chat message", { nickname, message });
      messageInput.value = "";
    }
  });

  socket.on("chat message", (msg) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    messageElement.textContent = `${msg.nickname} (${timestamp}): ${msg.message}`;
    messagesContainer.appendChild(messageElement);
  });
});
