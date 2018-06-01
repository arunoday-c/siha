export default {
  // API token key
  SECRETKey: "ALGAEH Technologies PVT Ltd HIMSv1",
  TOKENTIME: 2592000, // 60 * 60 * 30 ,
  // Server port and request body limit
  port: 3000,
  bodyLimit: "900kb",
  // Dev db
  mysqlDb: {
    connectionLimit: 20,
    host: "him-app-db-server.cue9pqguf30s.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "root",
    password: "medteam2013",
    database: "algaeh_hims_db",
    multipleStatements: true
  },

  logpath: "/logs", //log folder path
  logFileSize: "20m", //maximum size of log file.
  logFileDatePatter: "YYYYMMDD",
  logLevel:
    "debug" /*log printing based on parameters; 
 2 info:{Warning,infomation,error};
 1 warn:{warning,error};
 0 error:{error},
 4 debug:{debug,error,warning,information}
 */
};
