import dotenv from "dotenv";
import path from "path";
import { Sequelize } from "sequelize";
if (process.env.NODE_ENV !== "production") {
  dotenv.config({ path: path.join(process.cwd(), "../", ".env_local") });
}
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_DIALECT, DB_CONN_LMT } =
  process.env;

const sequelize = new Sequelize(`${DB_NAME}`, `${DB_USER}`, `${DB_PASSWORD}`, {
  host: DB_HOST,
  //@ts-ignore
  dialect: `${DB_DIALECT}`,
  logQueryParameters: true,
  pool: {
    max: parseInt(DB_CONN_LMT ?? "10", 10),
  },
});
export default sequelize;
