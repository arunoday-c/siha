import mysql from "mysql";
import algaehKeys from "algaeh-keys"; //"./keys/keys";
const config = algaehKeys.default;
export default callback => {
  let db = mysql.createPool(config.mysqlDb);
  callback(db);
};
