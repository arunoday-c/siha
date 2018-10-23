"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _http = require("http");

var _http2 = _interopRequireDefault(_http);

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require("body-parser");

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _keys = require("./keys/keys");

var _keys2 = _interopRequireDefault(_keys);

var _routes = require("./routes");

var _routes2 = _interopRequireDefault(_routes);

var _passport = require("passport");

var _passport2 = _interopRequireDefault(_passport);

var _cors = require("cors");

var _cors2 = _interopRequireDefault(_cors);

var _morgan = require("morgan");

var _morgan2 = _interopRequireDefault(_morgan);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _rotatingFileStream = require("rotating-file-stream");

var _rotatingFileStream2 = _interopRequireDefault(_rotatingFileStream);

var _httpStatus = require("./utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("./utils/logging");

var _jwtDecode = require("jwt-decode");

var _jwtDecode2 = _interopRequireDefault(_jwtDecode);

var _cryptography = require("./utils/cryptography");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var LocalStrategy = require("passport-local").Strategy;


var app = (0, _express2.default)();

if (process.env.NODE_ENV === "production") {
  console.log("Running prod....");
  console.log(process.env.NODE_ENV);
  app.use(_express2.default.static("client/build"));
}

app.server = _http2.default.createServer(app);

app.use((0, _cors2.default)());
//parse application json
app.use(_bodyParser2.default.json({
  limit: _keys2.default.bodyLimit
}));

//passport config
app.use(_passport2.default.initialize());
_passport2.default.use(new LocalStrategy({
  usernameField: "username",
  passwordField: "password"
}, function (username, password, done) {
  return done(null, username);
}));

_passport2.default.serializeUser(function (user, done) {
  done(null, user);
});
_passport2.default.deserializeUser(function (id, done) {
  done(null, { msg: "done" });
});

app.use(function (req, res, next) {
  var reqH = req.headers;

  var reqUser = "";
  if (req.url != "/api/v1/apiAuth") {
    reqUser = (0, _jwtDecode2.default)(reqH["x-api-key"]).id;
    if (req.url != "/api/v1/apiAuth/authUser") {
      var header = req.headers["x-app-user-identity"];

      if (header != null && header != "" && header != "null") {
        header = (0, _cryptography.decryption)(header);

        req.body.created_by = header.algaeh_d_app_user_id;
        req.body.updated_by = header.algaeh_d_app_user_id;
        req.userIdentity = header;
      } else {
        res.status(_httpStatus2.default.unAuthorized).json({
          success: false,
          message: "unauthorized credentials can not procees.."
        });
      }
    }
  }

  (0, _logging.requestTracking)("", {
    dateTime: new Date().toLocaleString(),
    requestIdentity: {
      requestClient: reqH["x-client-ip"],
      requestAPIUser: reqUser,
      reqUserIdentity: req.userIdentity
    },
    requestUrl: req.originalUrl,
    requestHeader: {
      host: reqH.host,
      "user-agent": reqH["user-agent"],
      "cache-control": reqH["cache-control"],
      origin: reqH.origin
    },

    requestMethod: req.method
  });

  next();
});

var logdir = _path2.default.join(__dirname, "../" + _keys2.default.logpath);
if (!_fs2.default.existsSync(logdir)) {
  _fs2.default.mkdirSync(logdir);
}

// var accessLogStream = fs.createWriteStream(path.join(logdir, "access.log"), {
//   flags: "a"
// });

var accessLogStream = (0, _rotatingFileStream2.default)("access.log", {
  size: "5M",
  path: logdir
});

app.use((0, _morgan2.default)("combined", { streamexceptionHandlers: accessLogStream }));
app.set("trust proxy", true);

//api routeres v1
app.use("/api/v1", _routes2.default);

process.on("warning", function (warning) {
  _logging.logger.log("warn", warning);
});
process.on("uncaughtException", function (error) {
  _logging.logger.log("error", error);
});
//Error Handling MiddleWare
app.use(function (error, req, res, next) {
  error.status = error.status || _httpStatus2.default.internalServer;
  res.status(error.status).json({
    success: false,
    message: error.sqlMessage != null ? error.sqlMessage : error.message
  });
  var _error = {
    source: req.originalUrl,
    requestClient: req.headers["x-client-ip"],
    reqUserIdentity: req.userIdentity,
    errorDescription: error
  };
  _logging.logger.log("error", "%j", _error);
});

app.server.listen(_keys2.default.port);
console.log("started on port " + app.server.address().port);

exports.default = app;

module.exports = app;
//# sourceMappingURL=server.js.map