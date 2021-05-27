import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";
// import hims_d_services from "./hims_d_services";
// import hims_adm_ward_detail from "./hims_adm_ward_detail";

class hims_f_atd_admission extends Model {}
hims_f_atd_admission.init(
  {
    hims_f_atd_admission_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admission_number: {
      type: DataTypes.STRING(45),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    admission_date: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    admission_type: {
      type: DataTypes.ENUM("D", "I"),
      defaultValue: "D",
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    ward_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    bed_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    sub_department_id: {
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
    ...userDetails,
  },
  {
    tableName: "hims_f_atd_admission",
    sequelize: db,
    ...dateConversions,
  }
);
(async () => {
  await hims_f_atd_admission.sync({
    alter: true,
  });
})();

// hims_f_atd_admission.belongsTo(hims_d_services, {
//   foreignKey: "services_id",
//   as: "S",
// });
// hims_d_services.hasOne(hims_f_atd_admission, {
//   foreignKey: "services_id",
//   as: "S",
// });

export default hims_f_atd_admission;
