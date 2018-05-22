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
    host: "159.89.163.148",
    port: 3306,
    user: "devteam",
    password: "devteam",
    database: "algaeh_hims_test_db",
    multipleStatements: true
  },

  logpath: "/logs"
};
