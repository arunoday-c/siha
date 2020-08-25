const utliites = require("./utilities");
const { userSecurity, getStreamingPermissions } = require("./checksecurity");
module.exports = {
  authentication: (req, res, next) => {
    const reqH = req.headers;
    const _token = reqH["x-api-key"];
    const _utilis = new utliites();
    const verify = _utilis.tokenVerify(_token);

    if (verify) {
      req.userIdentity = verify;
      const {
        username,
        stream,
        gatepass,
        algaeh_d_app_user_id,
        full_name,
        arabic_name,
        product_type,
        role_discreption,
        role_code,
        app_group_code,
        app_group_desc,
        employee_id,
        hims_d_hospital_id,
        hospital_name,
      } = verify;
      const parameters = req.method === "GET" ? req.query : req.body;
      let onlyUrl = req.originalUrl;
      if (req.method === "GET") {
        onlyUrl = onlyUrl.split("?")[0];
      }
      _utilis.logger("res-tracking").log(
        hims_d_hospital_id,
        {
          dateTime: new Date().toLocaleString(),
          requestClient: reqH["x-client-ip"],
          stream,
          algaeh_d_app_user_id,
          full_name,
          arabic_name,
          product_type,
          role_discreption,
          role_code,
          app_group_code,
          app_group_desc,
          employee_id,
          hims_d_hospital_id,
          hospital_name,
          requestUrl: onlyUrl,
          host: reqH.host,
          origin: reqH.origin,
          "user-agent": reqH["user-agent"],
          requestMethod: req.method,
          parameters: parameters,
        },
        "info"
      );

      if (stream === undefined) {
        userSecurity(reqH["x-client-ip"], username.toLowerCase())
          .then(() => {
            res.setHeader("connection", "keep-alive");
            next();
          })
          .catch((error) => {
            res
              .status(423)
              .json({
                success: false,
                message: error,
                username: error === "false" ? undefined : username,
              })
              .end();
            return;
          });
      } else {
        getStreamingPermissions(username)
          .then((result) => {
            if (Object.keys(result).length === 0) {
              res
                .status(_utilis.httpStatus().unAuthorized)
                .json({
                  success: false,
                  message:
                    "No access to any api.Please contact your software provider.",
                })
                .end();
            } else {
              next();
            }
          })
          .catch((error) => {
            res
              .status(_utilis.httpStatus().unAuthorized)
              .json({
                success: false,
                message: error,
              })
              .end();
          });
      }
    } else {
      res
        .status(_utilis.httpStatus().unAuthorized)
        .json({
          success: false,
          message: "unauthorized access",
        })
        .end();
    }
  },
};
