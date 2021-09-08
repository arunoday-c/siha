import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";
class hims_f_patient_encounter extends Model {}

hims_f_patient_encounter.init(
  {
    hims_f_patient_encounter_id: {
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
    episode_id: {
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
    payment_type: {
      type: DataTypes.ENUM("S", "I"),
      defaultValue: "S",
    },
    ip_id: { type: DataTypes.INTEGER },
    age: { type: DataTypes.INTEGER },
    ...userDetails,
  },
  {
    sequelize: db,
    tableName: "hims_f_patient_encounter",
    ...dateConversions,
  }
);

export default hims_f_patient_encounter;
