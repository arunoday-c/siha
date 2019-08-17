import React, { createContext } from "react";
import io from "socket.io-client";

function createUri(nsp) {
  const uri = "http://localhost:3019";
  return `${uri}${nsp}`;
}

export const SocketContext = createContext(null);

export const SocketProvider = props => {
  const CLIENTS = {
    ftdsk: io(createUri("/ftdsk"))
  };
  return (
    <SocketContext.Provider value={CLIENTS}>
      {props.children}
    </SocketContext.Provider>
  );
};
