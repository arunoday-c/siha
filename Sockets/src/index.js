import http from "http";
import cors from "cors";
import keys from "algaeh-keys";
import utilities from "algaeh-utilities";
import express from "express";
import socketAuth from "socketio-auth";
import socketIO from "socket.io";
import redisAdapter from "socket.io-redis";
const _port = process.env.PORT;
const exp = express();

//middlewares
exp.use(cors());
// exp.use(bodyParser())

const app = http.createServer(exp);

const io = socketIO(app);

io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

import { authenticate } from "./socketAuth";
import appsock from "./appointmentSocket";
import labsock from "./labSocket";
import selfServiceSocket from "./selfServiceSocket";
// socketAuth(io, {
//   authenticate,
//   timeout: "none"
// });

const utils = utilities.AlgaehUtilities();
// const logger = utils.logger();

process.on("warning", warn => {
  console.log("warn", warn, "warn");
});
process.on("uncaughtException", error => {
  console.log("uncatched Exception", error, "error");
});
process.on("unhandledRejection", (reason, promise) => {
  console.log(
    "Unhandled rejection",
    { reason: reason, promise: promise },
    "error"
  );
});

io.on("connection", socket => {
  socket.on("unauthorized", function(err) {
    console.log("There was an error with the authentication:", err.message);
  });

  socket.emit("/success", "hello, you are connected");

  socket.on("user_logged", function(user, moduleList, authToken) {
    try {
      console.log(`${user} connected`);
      console.log(moduleList, "modules");
      authToken = utils.tokenVerify(authToken);
      console.log(authToken.employee_id, "id");
      socket.join(authToken.employee_id, err => {});
      // socket.join(moduleList, err => console.log(err));
      socket.join(moduleList, err => {});
      console.log(io.clients().listenerCount(), socket.rooms, "count");
    } catch (e) {
      console.warn(e.message);
    }
  });

  socket.on("unauthorized", reason => {
    console.log("Unauthorized:", reason);

    error = reason.message;
    console.log(error);

    socket.disconnect();
  });

  socket.on("user_logout", function() {
    console.log(socket.rooms);
    socket.disconnect();
  });

  appsock(socket);
  labsock(socket);
  selfServiceSocket(socket);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.listen(_port);

console.log(`IO Sockets are running on PORT - *${_port}`);
