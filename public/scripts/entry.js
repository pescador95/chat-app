function redirectToChat() {
  const roomName = document.getElementById("room-name").value;
  const nickname = document.getElementById("nickname").value;

  window.location.href = `/chat?room=${roomName}&nickname=${nickname}`;

  const roomNameValue = document.getElementById("room-name-value");
  roomNameValue.textContent = `Sala: ${roomName}`;
}
document
  .getElementById("enter-button")
  .addEventListener("click", redirectToChat);
document
  .getElementById("nickname")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      redirectToChat();
    }
  });
document
  .getElementById("room-name")
  .addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      redirectToChat();
    }
  });
