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

  const newMessageSound = new Audio("../sounds/notification.mp3");

  const userJoin = new Audio("../sounds/login.mp3");

  const userLeft = new Audio("../sounds/logout.mp3");

  function playNewMessageSound() {
    newMessageSound.play();
  }

  function playLoginSound() {
    userJoin.play();
  }

  function playLogoutSound() {
    userLeft.play();
  }

  function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function addMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    const timestamp = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const nicknameWithBold = `<strong>${message.nickname}</strong>`;

    messageElement.innerHTML = `${nicknameWithBold} (${timestamp}): ${message.message}`;
    messagesContainer.appendChild(messageElement);

    scrollToBottom();
  }

  function addUserExitMessage(exitMessage) {
    const exitMessageElement = document.createElement("div");
    exitMessageElement.classList.add("exit-message");
    exitMessageElement.innerHTML = exitMessage;
    messagesContainer.appendChild(exitMessageElement);

    scrollToBottom();
  }

  socket.emit("joinRoom", roomName, nickname);

  socket.on("userEntered", (entryMessage) => {
    const entryMessageElement = document.createElement("div");
    entryMessageElement.classList.add("entry-message");
    entryMessageElement.innerHTML = entryMessage;
    messagesContainer.appendChild(entryMessageElement);
    playLoginSound();
    scrollToBottom();
  });

  socket.on("userExited", (exitMessage) => {
    const exitMessageElement = document.createElement("div");
    exitMessageElement.classList.add("entry-message");
    exitMessageElement.innerHTML = exitMessage;
    messagesContainer.appendChild(exitMessageElement);
    playLogoutSound();
    scrollToBottom();
  });

  messageInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const message = messageInput.value.trim();
      if (message && nickname) {
        socket.emit("chat message", { nickname, message, room: roomName });
        messageInput.value = "";
      }
    }
  });

  sendButton.addEventListener("click", () => {
    const message = messageInput.value;
    if (message && nickname) {
      socket.emit("chat message", { nickname, message, room: roomName });
      messageInput.value = "";
    }
  });

  socket.on("chat message", (msg) => {
    addMessage(msg);
    playNewMessageSound();
  });
});
