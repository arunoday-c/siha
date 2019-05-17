exports.default = {
  // API token key
  SECRETKey: "ALGAEH Technologies PVT Ltd HIMSv1",
  TOKENTIME: 2592000, // 60 * 60 * 30 ,
  // Server port and request body limit
  port: 3002,
  bodyLimit: "900kb",

  mysqlDb: {
    connectionLimit: 20,
    // host: "166.62.10.184",
    host: "49.206.18.38",
    port: 3306,
    user: "algaeh_root",
    password: "medteam2013",
    database: "algaeh_hims_db",
    multipleStatements: true,
    acquireTimeout: 20000,
    dateStrings: true,
    insecureAuth: true,
    waitForConnections: true, // Default value.
    queueLimit: 0, // Unlimited - default value.
    supportBigNumbers: true,
    bigNumberStrings: true
  },

  mongoDb: {
    connectionURI:
      "mongodb://algaeh_root:medteam2013@49.206.18.38:27017/algaeh_hims_mongo_db"
  },

  //Db Date format
  dbFormat: {
    date: "YYYY-MM-DD"
  },
  useSSL: false,
  chromePuppeteer:{
    headless: true,
      executablePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    
  }
};
