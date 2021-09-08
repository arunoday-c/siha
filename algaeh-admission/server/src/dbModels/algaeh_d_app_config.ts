import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";

class algaeh_d_app_config extends Model {}

algaeh_d_app_config.init(
  {
    algaeh_d_app_config_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    episode_id: {
      type: DataTypes.INTEGER,
    },
    ...userDetails,
  },
  {
    sequelize: db,
    tableName: "algaeh_d_app_config",
    ...dateConversions,
  }
);

export default algaeh_d_app_config;
