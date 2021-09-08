//@ts-ignore
import keys from "algaeh-keys/keys";
import { Sequelize } from "sequelize";

function getTimeZone() {
  var offset = new Date().getTimezoneOffset(),
    o = Math.abs(offset);
  return (
    (offset < 0 ? "+" : "-") +
    ("00" + Math.floor(o / 60)).slice(-2) +
    ":" +
    ("00" + (o % 60)).slice(-2)
  );
}

process.env.MYSQL_KEYS = JSON.stringify(keys?.default?.mysqlDb ?? "");

const {
  dialect,
  host,
  connectionLimit,
  user,
  password,
  database,
} = keys.default.mysqlDb;
const sequelize = new Sequelize(database ?? "", user ?? "", password ?? "", {
  host: host ?? "localhost",
  dialect,
  logging: process.env.NODE_ENV === "production" ? false : console.log,
  timezone: getTimeZone(),
  pool: {
    max: connectionLimit,
  },
});

export default sequelize;
