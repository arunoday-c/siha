import { Router } from "express";
import jwt from "jsonwebtoken";
const config = require("algaeh-keys/keys");

export default ({ db }) => {
  let api = Router();

  //add middleware
  api.use((req, res, next) => {
    req.db = db;
    if (req.url.includes ("/apiAuth")) {
      next();
    } else {
      var token = req.body.token || req.query.token || req.headers["x-api-key"];

      if (token) {
        jwt.verify(token, config.default.SECRETKey, (err, decoded) => {
          if (err) {
            return res.json({
              success: false,
              message: "Authentication failed"
            });
          } else {
            req.decoded = decoded;
            next();
          }
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "no token provided"
        });
      }
    }
  });
  return api;
};
