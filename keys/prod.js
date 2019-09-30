exports.default = {
  SECRETKey: "ALGAEH Technologies PVT Ltd HIMSv1",
  TOKENTIME: 2592000,
  port: 3002,
  bodyLimit: "900kb",

  mysqlDb: {
    connectionLimit: 20,
    host: "49.206.18.38",
    port: 3306,
    user: "algaeh_root",
    password: "alg_hea2018",
    database: "hims_test_db",
    multipleStatements: true,
    acquireTimeout: 20000,
    dateStrings: true,
    insecureAuth: true,
    waitForConnections: true,
    queueLimit: 0,
    supportBigNumbers: true,
    bigNumberStrings: true
  },
  mongoDb: {
    connectionURI: ""
  },
  dbFormat: {
    date: "YYYY-MM-DD"
  },
  useSSL: false,
  chromePuppeteer: {
    headless: true,
    executablePath:
      "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  }
};
