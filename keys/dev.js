exports.default = {
  // API token key
  SECRETKey: "ALGAEH Technologies PVT Ltd HIMSv1",
  TOKENTIME: 2592000, // 60 * 60 * 30 ,
  // Server port and request body limit
  port: 3000,
  bodyLimit: "900kb",

  mysqlDb: {
    connectionLimit: 100,
    // host: "166.62.10.184",
    host: "49.206.18.38",
    //host: "192.168.0.145",
    //host: "192.168.1.10",
    port: 3306,
    user: "algaeh_root",
    password: "alg_hea2018",
    //database: "algaeh_hims_db",
    database: "hims_test_db",
    // database: "seco",
    // database: "algaeh_hrms_oman_db",

    //database: "medical_db",

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
  running: {
    date: "20190429",
    counter: 0
  },
  //Db Date format
  dbFormat: {
    date: "YYYY-MM-DD"
  },
  useSSL: false,
  chromePuppeteer: {
    headless: true,
    executablePath:
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"
  }
};
