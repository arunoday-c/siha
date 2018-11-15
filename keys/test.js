export default {
  // API token key
  SECRETKey: "ALGAEH Technologies PVT Ltd HIMSv1",
  TOKENTIME: 2592000, // 60 * 60 * 30 ,
  // Server port and request body limit
  port: 3000,
  bodyLimit: "100kb",
  // Test db
  mysqlDb: {
    connectionLimit: 50,
    host: "him-app-db-server.cue9pqguf30s.ap-south-1.rds.amazonaws.com",
    port: 3306,
    user: "root",
    password: "algaeh2018",
    database: "algaeh_hims_db_test",
    multipleStatements: true
  },

  logpath: "/logs"
};
