exports.default = {
  SECRETKey: "ALGAEH Technologies PVT Ltd HIMSv1",
  TOKENTIME: 2592000,
  port: 3002,
  bodyLimit: "900kb",

  mysqlDb: {
    connectionLimit: 20,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
    connectionURI: process.env.MONGO_URI
  },
  redis: {
    host: "127.0.0.1",
    port: 6379,
    maxRetriesPerRequest: 5,
    reconnectOnError: function(err) {
      console.error(err);
      var targetError = "READONLY";
      if (err.message.slice(0, targetError.length) === targetError) {
        return true;
      }
    }
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
