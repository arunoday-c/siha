const process = require("process");

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
    // host: "192.168.0.102",
    // host: "127.0.0.1",

    port: 3306,
    user: "algaeh_root",
    password: "alg_hea2018",
    // password: "medteam2013",
    // database: "hims_test_db",
    //database: "twareat_live_db",
    //database: "awdesh_db",
    //database: "hims_test_db",
    // database: "seco",
    // database: "algaeh_hrms_oman_db",
    // database: "shahid_db",
    database: "shaksy_live_db",

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
    // for windows
    // executablePath:
    //   "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe"

    //for Mac
    executablePath: chromePathFinder()
  }
};

function chromePathFinder() {
  const OS = process.platform;
  if (OS === "win32") {
    return "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
  }
  if (OS === "darwin") {
    return "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
  }
  //for WSL not for actual link distro
  if (OS === "linux") {
    return "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe";
  }
}
