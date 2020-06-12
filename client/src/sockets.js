import io from "socket.io-client";
import config from "./utils/config.json";

const { sockets } = config.routersAndPorts;

function createSockets() {
  let _localaddress =
    window.location.protocol + "//" + window.location.hostname;
  // const PORT = window.location.port ? `:${sockets.port}` : "";
  // const URI = `${_localaddress}${PORT}`;
  const options = {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  }
  if(window.location.port){
    _localaddress = _localaddress + `:${sockets.port}`
  } else {
    options.path = sockets.path
  }
  options.transports = ['websocket']
  return io.connect(_localaddress, options);
}

const socket = createSockets();

socket.on("connect", () => {
  console.log("connected");
});

socket.on("disconnect", () => {
  socket.open();
});

export default socket;
