import dotenv from "dotenv";
import { Sequelize } from "sequelize";
import path from "path";
const { NODE_ENV } = process.env;
if (NODE_ENV !== "production") {
  dotenv.config({ path: path.join(process.cwd(), "../", ".env_local") });
}
const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT, DB_CONN_LMT } =
  process.env;
const sequelize = new Sequelize(`${DB_NAME}`, `${DB_USER}`, DB_PASSWORD, {
  host: DB_HOST,
  //@ts-ignore
  dialect: DB_DIALECT ?? "mssql",
  logging: NODE_ENV === "production" ? false : console.log,
  logQueryParameters: NODE_ENV === "production" ? false : true,
  pool: {
    max: parseInt(`${DB_CONN_LMT}`) ?? 10,
  },
});
export default sequelize;
