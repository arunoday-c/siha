import io from "socket.io-client";

const socket = nsp => {
  const uri = "http://localhost:3019";
  if (nsp) {
    return io(`${uri}${nsp}`);
  } else {
    return io(uri);
  }
};

export default socket;
