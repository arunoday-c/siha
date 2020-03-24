import { Router } from "express";
import passport from "passport";
import utils from "../utils";
import httpStatus from "../utils/httpStatus";
import authmiddleware from "../middleware/authmiddleware";
import account from "../model/account";
import cryptography from "../utils/cryptography";
import moment from "moment";
const { apiAuth, authUser, apiAuthentication, userCheck } = account;
const { releaseConnection } = utils;
const {
  generateAccessToken,
  respond,
  authenticate,
  createJWTToken
} = authmiddleware;
const { encryption } = cryptography;

import {
  hGetUser,
  hSetUser,
  clientDecrypt,
  hDelUser,
  userSecurity,
  setStreamingPermissions,
  deleteStramingPermissions
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
  api.get("/", apiAuth, respond); //generateAccessToken, respond);

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

      hGetUser(username.toLowerCase()).then(result => {
        if (Object.keys(result).length === 0) {
          next();
        } else {
          const { loginDateTime, user_display_name, identity } = result;
          let identityName = loginDateTime;
          try {
            const jsonIdentity = JSON.parse(identity);
            identityName = `<table class="swallHTMLMsg"><tr><td><span>Time:</span></td><td>${loginDateTime}</td></tr><tr><td><span>Mac address:</span></td><td>${jsonIdentity.mac}.</td></tr><tr><td><span>Machine Name:</span></td><td>${jsonIdentity.name}.</td></tr><tr><td><span>IP address:</span></td><td>${jsonIdentity.address}.</td></tr></table>`;
          } catch (e) {
            identityName = loginDateTime;
          }
          console.log("msg", identityName);
          res.status(httpStatus.ok).json({
            success: false,
            // '${identity}'
            //'${user_display_name}'
            message: `Machine Details ${identityName}`
          });
        }
      });
    },
    /* To Authorise user login */
    authUser,
    (req, res, next) => {
      let result = req.records;
      if (result[0].length == 0) {
        next(
          httpStatus.generateError(
            httpStatus.notFound,
            "The password is incorrect. Try again."
          )
        );
      } else {
        if (result[0][0]["locked"] === "N") {
          let rowDetails = result[0][0];
          let encrypDetsil = { ...result[0][0], ...result[1][0] };
          let hospitalDetails = { ...result[1][0] };

          // let keyData = encryption(encrypDetsil);
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
              token: createJWTToken(
                {
                  ...encrypDetsil,
                  ...specfic_date,
                  role_id: rowDetails.app_d_app_roles_id
                },
                false
              ),
              // keyResources: keyData,
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
      hSetUser(username.toLowerCase(), {
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
        if (result[0][0]["locked"] === "N") {
          let rowDetails = result[0][0];
          let encrypDetsil = { ...result[0][0], ...result[1][0] };
          let hospitalDetails = { ...result[1][0] };

          // let keyData = encryption(encrypDetsil);
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
              //keyResources: keyData,
              token: createJWTToken(
                {
                  ...encrypDetsil,
                  ...specfic_date,
                  role_id: rowDetails.app_d_app_roles_id
                },
                false
              ),
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
      hDelUser(username.toLowerCase());
      next();
    },
    /* Put user to check already used. */
    (req, res) => {
      const { records } = req.result;
      const { user_display_name, username, keyData } = records;
      const { roles_id, hospital_id, group_id, user_id } = keyData;
      const { identity } = req.body;
      hSetUser(username.toLowerCase(), {
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
        userSecurity(req.headers["x-client-ip"], username.toLowerCase())
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
  api.get("/getAPI", apiAuthentication, (req, res, next) => {
    let result = req.records;
    if (result[0].length === 0) {
      next(httpStatus.generateError(httpStatus.notFound, "No record found"));
    } else {
      if (result[0][0]["locked"] === "N") {
        let encrypDetsil = { ...result[0][0], ...result[1][0] };
        let details = createJWTToken(encrypDetsil);
        setStreamingPermissions(
          encrypDetsil.username.toLowerCase(),
          encrypDetsil
        )
          .then(() => {
            res
              .status(httpStatus.ok)
              .json({
                success: true,
                records: {
                  "x-api-token": details
                }
              })
              .end();
          })
          .catch(error => {
            res
              .status(httpStatus.ok)
              .json({
                success: true,
                message: error
              })
              .end();
          });
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
  });
  api.put("/removeAPI", (req, res, next) => {
    const { username } = req.body;
    deleteStramingPermissions(username);
    res.status(httpStatus.ok).json({
      message: "Permission to access api is successfully removed",
      success: true
    });
  });
  api.post("/userCheck", userCheck, (req, res) => {
    res.status(httpStatus.ok).json({
      success: true,
      records: req.records
    });
  });
  return api;
};
