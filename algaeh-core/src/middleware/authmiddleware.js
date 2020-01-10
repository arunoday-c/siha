import jwt from "jsonwebtoken";
import expressjwt from "express-jwt";
//import config from "../keys/keys";
const config = require("algaeh-keys/keys");
import moment from "moment";
// const TOKENTIME = config.default.TOKENTIME;
const SECRET = config.default.SECRETKey;

let authenticate = expressjwt({ secret: SECRET });

let generateAccessToken = (req, res, next) => {
  const { success, token } = req.result;
  // req.token = req.token || {};
  // req.result.success = req.result.success || false;
  if (success === true) {
    req.token = jwt.sign(
      {
        id: req.body.username,
        iat: Math.floor(Date.now() / 1000) - 30
      },
      SECRET
      // {
      //   expiresIn: "10d" //TOKENTIME
      // }
    );
    next();
  }
};

let createJWTToken = (dataToSave, useStream) => {
  const stream =
    useStream === undefined
      ? {
          stream: true
        }
      : useStream === true
      ? {
          stream: true
        }
      : {};
  return jwt.sign(
    {
      ...dataToSave,
      ...stream
    },
    SECRET
  );
};

// const days = moment.duration(TOKENTIME, "seconds").asDays();

let respond = (req, res) => {
  res.status(200).json({
    user: req.user,
    hospitalList: req.result.hospitalList,
    activemoduleList: [] //req.result.activemoduleList
  });
};

export default {
  authenticate,
  generateAccessToken,
  respond,
  createJWTToken
};
