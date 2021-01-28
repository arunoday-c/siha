import mysql from "mysql2/promise";
import keys from "algaeh-keys/keys";
// if (process.env.NODE_ENV === "development") {
const defaultKeys = keys.default;
process.env.MYSQL_KEYS = JSON.stringify(defaultKeys.mysqlDb);
// }
const {
  acquireTimeout,
  insecureAuth,
  maxReuseCount,
  minEvictableIdleTimeMillis,
  ...config
} = JSON.parse(process.env.MYSQL_KEYS ?? "");
// process.env.PRIMARY_DB = config.database;
export default mysql.createPool(config);
