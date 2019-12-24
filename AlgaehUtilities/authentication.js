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
      const { username, stream, gatepass } = verify;

      _utilis.logger("res-tracking").log(
        "",
        {
          dateTime: new Date().toLocaleString(),
          requestIdentity: {
            requestClient: reqH["x-client-ip"],
            reqUserIdentity: verify
          },
          requestUrl: req.originalUrl,
          requestHeader: {
            host: reqH.host,
            "user-agent": reqH["user-agent"],
            "cache-control": reqH["cache-control"],
            origin: reqH.origin
          },
          requestMethod: req.method
        },
        "info"
      );

      if (stream === undefined) {
        userSecurity(reqH["x-client-ip"], username.toLowerCase())
          .then(() => {
            res.setHeader("connection", "keep-alive");
            next();
          })
          .catch(error => {
            res
              .status(423)
              .json({
                success: false,
                message: error,
                username: error === "false" ? undefined : username
              })
              .end();
            return;
          });
      } else {
        getStreamingPermissions(username)
          .then(result => {
            if (Object.keys(result).length === 0) {
              res
                .status(_utilis.httpStatus().unAuthorized)
                .json({
                  success: false,
                  message:
                    "No access to any api.Please contact your software provider."
                })
                .end();
            } else {
              next();
            }
          })
          .catch(error => {
            res
              .status(_utilis.httpStatus().unAuthorized)
              .json({
                success: false,
                message: error
              })
              .end();
          });
      }
    } else {
      res
        .status(_utilis.httpStatus().unAuthorized)
        .json({
          success: false,
          message: "unauthorized access"
        })
        .end();
    }
  },
  authenticationKoa: (ctx, next) => {
    const reqH = ctx.headers;
    const _token = reqH["x-api-key"];
    const _utilis = new utliites();
    const verify = _utilis.tokenVerify(_token);

    if (verify) {
      ctx.userIdentity = verify;
      const { username, stream, gatepass } = verify;

      _utilis.logger("res-tracking").log(
        "",
        {
          dateTime: new Date().toLocaleString(),
          requestIdentity: {
            requestClient: reqH["x-client-ip"],
            reqUserIdentity: verify
          },
          requestUrl: ctx.url.originalUrl,
          requestHeader: {
            host: reqH.host,
            "user-agent": reqH["user-agent"],
            "cache-control": reqH["cache-control"],
            origin: reqH.origin
          },
          requestMethod: ctx.method
        },
        "info"
      );

      if (stream === undefined) {
        userSecurity(reqH["x-client-ip"], username.toLowerCase())
          .then(() => {
            ctx.set("connection", "keep-alive");
            next();
          })
          .catch(error => {
            ctx.status = 423;
            ctx.body = {
              success: false,
              message: error,
              username: error === "false" ? undefined : username
            };
            return;
          });
      } else {
        getStreamingPermissions(username)
          .then(result => {
            if (Object.keys(result).length === 0) {
              ctx.status = _utilis.httpStatus().unAuthorized;
              ctx.body = {
                success: false,
                message:
                  "No access to any api.Please contact your software provider."
              };
              // res.status(_utilis.httpStatus().unAuthorized).json().end();
            } else {
              next();
            }
          })
          .catch(error => {
            ctx.status = _utilis.httpStatus().unAuthorized;
            ctx.body = {
              success: false,
              message: error,
              username: error === "false" ? undefined : username
            };
            // res.status(_utilis.httpStatus().unAuthorized).json({
            //     success: false,
            //     message: error
            // }).end();
          });
      }
    } else {
      ctx.status = _utilis.httpStatus().unAuthorized;
      ctx.body = {
        success: false,
        message: error,
        username: error === "false" ? undefined : username
      };
      // res.status(_utilis.httpStatus().unAuthorized).json({
      //     success: false,
      //     message: "unauthorized access"
      // }).end();
    }
  }
};
