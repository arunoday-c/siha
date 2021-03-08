//@ts-ignore
import keys from "algaeh-keys/keys";
import { Sequelize } from "sequelize";
process.env.MYSQL_KEYS = JSON.stringify(keys.default.mysqlDb);

const {
  dialect,
  host,
  connectionLimit,
  user,
  password,
  database,
} = keys.default.mysqlDb;
const sequelize = new Sequelize(database, user, password, {
  host,
  dialect,
  logging: process.env.NODE_ENV === "production" ? false : true,

  pool: {
    max: connectionLimit,
  },
});
export default sequelize;
