import io from "socket.io-client";
import { getCookie } from "./utils/algaehApiCall";

function createSockets() {
  const _localaddress =
    window.location.protocol + "//" + window.location.hostname + ":";
  const PORT = "3019";
  const URI = `${_localaddress}${PORT}`;
  return io.connect(URI, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5
  });
}

const socket = createSockets();

socket.on("connect", () => {
  console.log("connected");
});

// socket.on("connect", () => {
//   socket.emit("authentication", { token: getCookie("authToken") });
// });

socket.on("disconnect", () => {
  socket.open();
});

export default socket;
