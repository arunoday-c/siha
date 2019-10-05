import { Router } from "express";
import passport from "passport";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import authmiddleware from "../middleware/authmiddleware";
import account from "../model/account";
import cryptography from "../utils/cryptography";
import logging from "../utils/logging";
import moment from "moment";
const { apiAuth, authUser } = account;
const { releaseConnection } = utils;
const { generateAccessToken, respond, authenticate } = authmiddleware;
const { encryption } = cryptography;
const { debugLog } = logging;
import {
  hGetUser,
  hSetUser,
  clientDecrypt,
  hDelUser,
  userSecurity
} from "algaeh-utilities/checksecurity";
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
    /*Decrypt client data*/
    (req, res, next) => {
      const { post } = req.body;
      const bodyDetails = JSON.parse(clientDecrypt(post));
      req.body = bodyDetails;
      next();
    },
    /* To check user is already login */
    (req, res, next) => {
      const { username, identity } = req.body;
      if (identity === null && identity === "") {
        res.status(httpStatus.badRequest).json({
          success: false,
          message: "We support latest version of Google Chrome please update."
        });
        return;
      }
      hGetUser(username).then(result => {
        if (Object.keys(result).length === 0) {
          next();
        } else {
          const { loginDateTime, user_display_name, identity } = result;
          res.status(httpStatus.ok).json({
            success: false,
            message: ` '${user_display_name}' already login from identity ${identity} on ${loginDateTime},
            it will truncate all transactions from current using session.`
          });
        }
      });
    },
    /* To Authorise user login */
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
    /* Put user to check already used. */
    (req, res) => {
      const { records } = req.result;
      const { user_display_name, username, keyData } = records;
      const { roles_id, hospital_id, group_id, user_id } = keyData;
      const { identity } = req.body;
      hSetUser(username, {
        user_display_name: user_display_name,
        loginDateTime: moment().format("LLLL"),
        user_id: user_id,
        roles_id: roles_id,
        hospital_id: hospital_id,
        group_id: group_id,
        identity: identity
      }).then(() => {
        res.status(httpStatus.ok).json(req.result);
      });
    }
  );

  api.post(
    "/relogin" /*Decrypt client data*/,
    (req, res, next) => {
      const { post } = req.body;

      const bodyDetails = JSON.parse(clientDecrypt(post));
      req.body = bodyDetails;

      next();
    } /* To Authorise user login */,
    authUser,
    (req, res, next) => {
      let result = req.records;
      if (result[0].length === 0) {
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
    (req, res, next) => {
      req.logout();
      next();
    },
    passport.authenticate("local", {
      session: false,
      scope: []
    }),
    (req, res, next) => {
      const { username } = req.body;
      hDelUser(username);
      next();
    },
    /* Put user to check already used. */
    (req, res) => {
      const { records } = req.result;
      const { user_display_name, username, keyData } = records;
      const { roles_id, hospital_id, group_id, user_id } = keyData;
      const { identity } = req.body;
      hSetUser(username, {
        user_display_name: user_display_name,
        loginDateTime: moment().format("LLLL"),
        user_id: user_id,
        roles_id: roles_id,
        hospital_id: hospital_id,
        group_id: group_id,
        identity: identity
      }).then(() => {
        res.status(httpStatus.ok).json(req.result);
      });
    }
  );
  api.get("/logout", (req, res, next) => {
    try {
      if (req.userIdentity !== undefined) {
        const { username } = req.userIdentity;
        console.log(req.headers["x-client-ip"]);
        userSecurity(req.headers["x-client-ip"], username)
          .then(result => {
            hDelUser(username);
            req.logout();
            res.json({
              success: true,
              message: "Successfully Logout"
            });
          })
          .catch(error => {
            res.status(httpStatus.locked).json({
              success: false,
              message: error,
              username: username
            });
          });
      }
    } catch (e) {
      next(e);
    }
  });
  return api;
};
