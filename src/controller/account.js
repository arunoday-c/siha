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
      if (result[0].length == 0) {
        next(httpStatus.generateError(httpStatus.notFound, "No record found"));
      } else {
        if (result[0][0]["locked"] == "N") {
          let rowDetails = result[0][0];
          debugLog("rowDetails: ", rowDetails);
          let encrypDetsil = { ...result[0][0], ...result[1][0] };
          let hospitalDetails = { ...result[1][0] };

          let keyData = encryption(encrypDetsil);
          let specfic_date = {
            user_id: rowDetails.algaeh_d_app_user_id,
            roles_id: rowDetails.app_d_app_roles_id,
            hospital_id: rowDetails.hospital_id,
            group_id: rowDetails.algaeh_d_app_group_id,
            employee_branch: rowDetails.employee_branch
          };
          // let keymoduleDetails = encryption(hospitalDetails);

          res.status(httpStatus.ok).json({
            success: true,
            records: {
              username: rowDetails["username"],
              user_display_name: rowDetails["user_display_name"],
              keyResources: keyData,
              keyData: specfic_date,
              secureModels: req.secureModels,
              hospitalDetails: hospitalDetails,
              app_d_app_roles_id: rowDetails.app_d_app_roles_id,
              page_to_redirect: rowDetails.page_to_redirect
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
