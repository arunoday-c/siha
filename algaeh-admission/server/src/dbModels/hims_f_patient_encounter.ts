import { DataTypes, Model } from "sequelize";
import db from "../connection";
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
    tableName: "hims_f_patient_encounter",
  }
);

export default hims_f_patient_encounter;
