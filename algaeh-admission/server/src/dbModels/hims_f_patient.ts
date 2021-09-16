import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";
class hims_f_patient extends Model {}

hims_f_patient.init(
  {
    hims_d_patient_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_code: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    full_name: {
      type: DataTypes.STRING(180),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    arabic_name: {
      type: DataTypes.STRING(180),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    nationality_id: {
      type: DataTypes.INTEGER,
    },
    primary_id_no: {
      type: DataTypes.STRING(50),
    },
    gender: {
      type: DataTypes.STRING(15),
    },
    ...userDetails,
  },
  {
    sequelize: db,
    tableName: "hims_f_patient",
    ...dateConversions,
  }
);

export default hims_f_patient;
