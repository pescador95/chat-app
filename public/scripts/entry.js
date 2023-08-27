document.getElementById("enter-button").addEventListener("click", function () {
  const roomName = document.getElementById("room-name").value;
  const nickname = document.getElementById("nickname").value;

  window.location.href = `/chat?room=${roomName}&nickname=${nickname}`;
});
