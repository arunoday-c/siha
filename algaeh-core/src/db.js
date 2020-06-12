let mysql = require("mysql");
import mysqlBooster from "mysql-pool-booster";
mysql = mysqlBooster(mysql);
import algaehKeys from "algaeh-keys"; //"./keys/keys";
const config = algaehKeys.default;
export default (callback) => {
  let db = mysql.createPool(config.mysqlDb);
  callback(db);
};
