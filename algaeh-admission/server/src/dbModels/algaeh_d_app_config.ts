import { DataTypes, Model } from "sequelize";
import db from "../connection";
class algaeh_d_app_config extends Model {}

algaeh_d_app_config.init(
  {
    algaeh_d_app_config_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    provider_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    source: {
      type: DataTypes.ENUM("O", "I"),
      defaultValue: "I",
    },
  },
  {
    sequelize: db,
    tableName: "algaeh_d_app_config",
  }
);

export default algaeh_d_app_config;
