import dotenv from "dotenv";
import { Sequelize } from "sequelize";
dotenv.config();

const { DB_DIALECT, DB_HOST, SMS_DB_CONN_LMT, DB_USER, DB_PASSWORD, DB_NAME } =
  process.env;
const sequelize = new Sequelize(
  DB_NAME ?? "",
  DB_USER ?? "",
  DB_PASSWORD ?? "",
  {
    host: DB_HOST ?? "localhost",
    //@ts-ignore
    dialect: DB_DIALECT,
    logging: process.env.NODE_ENV === "production" ? false : false,
    logQueryParameters: true,
    pool: {
      max: parseInt(SMS_DB_CONN_LMT ?? "10", 10),
    },
  }
);

export default sequelize;
