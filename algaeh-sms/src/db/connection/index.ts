import dotenv from "dotenv";
import { Sequelize } from "sequelize";
if (process.env.NODE_ENV !== "production") dotenv.config();

const { SQL_TYPE, SQL_DB, SMS_DB_CONN_LMT, SQL_USER, SQL_PASSWORD, SQL_HOST } =
  process.env;
const sequelize = new Sequelize(
  SQL_DB ?? "",
  SQL_USER ?? "",
  SQL_PASSWORD ?? "",
  {
    host: SQL_HOST ?? "localhost",
    //@ts-ignore
    dialect: SQL_TYPE ?? "mysql",
    logging: process.env.NODE_ENV === "production" ? false : false,
    logQueryParameters: true,
    pool: {
      max: parseInt(SMS_DB_CONN_LMT ?? "10", 10),
    },
  }
);

export default sequelize;
