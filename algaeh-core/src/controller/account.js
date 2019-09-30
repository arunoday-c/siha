import { Router } from "express";
import passport from "passport";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import authmiddleware from "../middleware/authmiddleware";
import account from "../model/account";
import cryptography from "../utils/cryptography";
import logging from "../utils/logging";

const { apiAuth, authUser } = account;
const { releaseConnection } = utils;
const { generateAccessToken, respond, authenticate } = authmiddleware;
const { encryption } = cryptography;
const { debugLog } = logging;

export default ({ config, db }) => {
  let api = Router();
  // '/v1/apiAuth'
  // api.get(
  //   "/",
  //   apiAuth,
  //   passport.authenticate("local", {
  //     session: false,
  //     scope: []
  //   }),
  //
  //   generateAccessToken,
  //   respond
  // );
  api.get("/", apiAuth, generateAccessToken, respond);

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
          let encrypDetsil = { ...result[0][0], ...result[1][0] };
          let hospitalDetails = { ...result[1][0] };

          let keyData = encryption(encrypDetsil);
          let specfic_date = {
            user_id: rowDetails.algaeh_d_app_user_id,
            roles_id: rowDetails.app_d_app_roles_id,
            hospital_id: rowDetails.hospital_id,
            group_id: rowDetails.algaeh_d_app_group_id
          };
          // let keymoduleDetails = encryption(hospitalDetails);

          // res.status(httpStatus.ok).json({
          //   success: true,
          //   records: {
          //     username: rowDetails["username"],
          //     user_display_name: rowDetails["user_display_name"],
          //     keyResources: keyData,
          //     keyData: specfic_date,
          //     secureModels: req.secureModels,
          //     hospitalDetails: hospitalDetails,
          //     app_d_app_roles_id: rowDetails.app_d_app_roles_id,
          //     page_to_redirect: rowDetails.page_to_redirect
          //   }
          // });
          req.result = {
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
          };
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
    passport.authenticate("local", {
      session: false,
      scope: []
    }),
    (req, res) => {
      res.status(httpStatus.ok).json(req.result);
    }
  );

  return api;
};
