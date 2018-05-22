import mysql from "mysql";
import config from "./keys/keys";

export default callback => {
  let db = mysql.createPool(config.mysqlDb);
  callback(db);
};
