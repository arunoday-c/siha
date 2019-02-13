import { Router } from "express";
import passport from "passport";
import { releaseConnection } from "../utils";
import httpStatus from "../utils/httpStatus";
import {
  generateAccessToken,
  respond,
  authenticate
} from "../middleware/authmiddleware";
import { apiAuth, authUser } from "../model/account";
import { encryption } from "../utils/cryptography";
import { debugLog } from "../utils/logging";

export default ({ config, db }) => {
  let api = Router();
  // '/v1/apiAuth'
  api.get(
    "/",
    apiAuth,
    passport.authenticate("local", {
      session: false,
      scope: []
    }),

    generateAccessToken,
    respond
  );

  //'/v1/authUser
  api.post(
    "/authUser",
    authUser,
    (req, res, next) => {
      let result = req.records;
      if (result.length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No record found"));
      } else {
        if (result[0][0]["locked"] == "N") {
          let rowDetails = result[0][0];
          debugLog("rowDetails: ", rowDetails);
          let encrypDetsil = { ...result[0][0], ...result[1][0] };

          debugLog("encrypDetsil: ", encrypDetsil);
          let keyData = encryption(encrypDetsil);
          res.status(httpStatus.ok).json({
            success: true,
            records: {
              username: rowDetails["username"],
              user_displayname: rowDetails["user_displayname"],
              keyResources: keyData,
              secureModels: req.secureModels
            }
          });
          next();
        } else {
          next(
            httpStatus.generateError(
              httpStatus.locked,
              "user ' " +
                inputData.username.toUpperCase() +
                " ' locked please\
                        contact administrator."
            )
          );
        }
      }
    },
    releaseConnection
  );

  return api;
};
