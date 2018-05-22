"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  // API token key
  SECRETKey: "ALGAEH Technologies PVT Ltd HIMSv1",
  TOKENTIME: 2592000, // 60 * 60 * 30 ,
  // Server port and request body limit
  port: 3000,
  bodyLimit: "900kb",
  // Dev db
  mysqlDb: {
    connectionLimit: 20,
    host: "159.89.163.148",
    port: 3306,
    user: "devteam",
    password: "devteam",
    database: "algaeh_hims_db",
    multipleStatements: true
  },

  logpath: "/logs", //log folder path
  logFileSize: "20m", //maximum size of log file.
  logFileDatePatter: "YYYYMMDD",
  logLevel: "debug" /*log printing based on parameters; 
                    2 info:{Warning,infomation,error};
                    1 warn:{warning,error};
                    0 error:{error},
                    4 debug:{debug,error,warning,information}
                    */
};
//# sourceMappingURL=dev.js.map