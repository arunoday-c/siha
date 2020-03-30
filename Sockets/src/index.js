import http from "http";
import cors from "cors";
import keys from "algaeh-keys";
import utilities from "algaeh-utilities";
import express from "express";
import socketAuth from "socketio-auth";
import socketIO from "socket.io";
import redisAdapter from "socket.io-redis";
import mongoose from "mongoose";
import { authenticate, postAuthenticate, disconnect } from "./socketAuth";
import { notifiModel } from "./model";
import appsock from "./appointmentSocket";
import labsock from "./labSocket";
import selfServiceSocket from "./selfServiceSocket";
const _port = process.env.PORT;
const exp = express();

mongoose.connect(keys.default.mongoDb.connectionURI, {
  useNewUrlParser: true,
  useFindAndModify: true,
  useUnifiedTopology: true
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
  // we're connected!
  //middlewares
  exp.use(cors());
  // exp.use(bodyParser())

  const app = http.createServer(exp);

  const io = socketIO(app);

  io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

  socketAuth(io, {
    authenticate,
    postAuthenticate,
    disconnect,
    timeout: "none"
  });

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

    // socket.on("user_logged", function(user, moduleList, authToken) {
    //   try {
    //     authToken = utils.tokenVerify(authToken);
    //     socket.join(authToken.employee_id, err => {});
    //     // socket.join(moduleList, err => console.log(err));
    //     socket.join(moduleList, err => {});
    //   } catch (e) {
    //     console.warn(e.message);
    //   }
    // });

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

    socket.on("getAll", () => {
      console.log(socket.client.user, "user id");
      notifiModel.find(
        {
          user_id: socket.client.user
        },
        (err, docs) => {
          console.log(docs, err, "docs");
          if (!err) {
            socket.emit("receiveAll", docs);
          }
        }
      );
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
});
