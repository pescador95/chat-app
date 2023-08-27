const socket = io();

const urlParams = new URLSearchParams(window.location.search);
const nickname = urlParams.get("nickname");

const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");

sendButton.addEventListener("click", () => {
  const message = messageInput.value;
  if (message && nickname) {
    socket.emit("chat message", { nickname, message });
    messageInput.value = "";
  }
});

socket.on("chat message", (msg) => {
  const messageElement = document.createElement("div");
  messageElement.textContent = msg.nickname + ": " + msg.message;
  messagesContainer.appendChild(messageElement);
});
