import jwt from "jsonwebtoken";
import expressjwt from "express-jwt";
import config from "../keys/keys";
const TOKENTIME = config.TOKENTIME;
const SECRET = config.SECRETKey;

let authenticate = expressjwt({ secret: SECRET });

let generateAccessToken = (req, res, next) => {
  req.token = req.token || {};
  req.result.success = req.result.success || false;
  if (req.result.success == true) {
    req.token = jwt.sign(
      {
        id: req.body.username
      },
      SECRET,
      {
        expiresIn: TOKENTIME
      }
    );
    next();
  }
};

let respond = (req, res) => {
  res.status(200).json({
    user: req.user,
    token: req.token
  });
};

module.exports = {
  authenticate,
  generateAccessToken,
  respond
};
