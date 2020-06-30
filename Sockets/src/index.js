import "core-js/stable";
import "regenerator-runtime/runtime";
import process from "process";
import http from "http";
import cors from "cors";
import keys from "algaeh-keys";
import utilities from "algaeh-utilities";
import express from "express";
import socketAuth from "socketio-auth";
import socketIO from "socket.io";
import redisAdapter from "socket.io-redis";
import moment from "moment";
import mongoose from "mongoose";
import { authenticate, postAuthenticate, disconnect } from "./socketAuth";
import { notifiModel } from "./model";
import { deleteNotification, acknowledgement, seen } from "./utils";
import appsock from "./appointmentSocket";
import labsock from "./labSocket";
import selfServiceSocket from "./selfServiceSocket";
import purchase from "./purchase";
import pharmacy from "./pharmacy";
const _port = process.env.PORT;
const exp = express();

mongoose.connect(keys.default.mongoDb.connectionURI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  // we're connected!
  //middlewares
  exp.use(cors());
  // exp.use(bodyParser())

  const app = http.createServer(exp);
  const options = {};
  if (process.env.NODE_ENV === "production") {
    options.path = "/";
    options.transports = ["websocket"];
  }
  const io = socketIO(app, options);

  io.adapter(redisAdapter({ host: "localhost", port: 6379 }));

  socketAuth(io, {
    authenticate,
    postAuthenticate,
    disconnect,
    timeout: "none",
  });

  const utils = utilities.AlgaehUtilities();
  // const logger = utils.logger();

  process.on("warning", (warn) => {
    console.log("warn", warn, "warn");
  });
  process.on("uncaughtException", (error) => {
    console.log("uncatched Exception", error, "error");
  });
  process.on("unhandledRejection", (reason, promise) => {
    console.log(
      "Unhandled rejection",
      { reason: reason, promise: promise },
      "error"
    );
  });

  io.on("connection", (socket) => {
    socket.on("unauthorized", function (err) {
      console.log("There was an error with the authentication:", err.message);
    });

    socket.on("unauthorized", (reason) => {
      console.log("Unauthorized:", reason);

      error = reason.message;
      console.log(error);

      socket.disconnect();
    });

    socket.once("user_logout", function () {
      socket.client.user = "";
      // socket.removeAllListeners();
      // socket.disconnect();
    });

    socket.on("getAll", () => {
      notifiModel
        .find({
          user_id: socket.client.user,
        })
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          if (!err) {
            socket.emit("receiveAll", docs);
          }
        });
      notifiModel
        .find({
          user_id: socket.client.user,
          createdAt: {
            $gt: moment().startOf("day"),
            $lt: moment().endOf("day"),
          },
        })
        .sort({ createdAt: -1 })
        .exec((err, docs) => {
          if (!err) {
            socket.emit("today", docs);
          }
        });
      notifiModel.countDocuments(
        {
          user_id: socket.client.user,
          isSeen: false,
        },
        (err, count) => {
          if (!err) {
            socket.emit("count", count);
          }
        }
      );
    });

    socket.on("delete", (id) => {
      deleteNotification({ id })
        .then((result) => {
          socket.emit("removed", result);
        })
        .catch((err) => {
          socket.emit("error", err.message);
        });
    });

    socket.on("acknowledge", (doc) => {
      acknowledgement(doc);
    });

    socket.on("seen", (doc) => {
      seen(socket);
    });

    appsock(socket);
    labsock(socket);
    selfServiceSocket(socket);
    purchase(socket);
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  });

  pharmacy(io);
  app.listen(_port);

  console.log(`IO Sockets are running on PORT - *${_port}`);
});
