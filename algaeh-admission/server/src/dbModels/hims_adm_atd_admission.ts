import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";
import hims_adm_ip_bed from "./hims_adm_ip_bed";
import hims_adm_ward_header from "./hims_adm_ward_header";
import hims_f_patient from "./hims_f_patient";

class hims_adm_atd_admission extends Model {}
hims_adm_atd_admission.init(
  {
    hims_adm_atd_admission_id: {
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
    age_in_years: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    age_in_months: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    age_in_days: {
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
    bed_no: {
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
    insurance_yesno: {
      type: DataTypes.ENUM("N", "Y"),
      defaultValue: "N",
    },
    insurance_provider_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    insurance_sub_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    network_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    insurance_network_office_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    policy_number: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ...userDetails,
  },
  {
    tableName: "hims_adm_atd_admission",
    sequelize: db,
    ...dateConversions,
  }
);
// (async () => {
//   await hims_adm_atd_admission.sync({
//     alter: true,
//   });
// })();

hims_adm_atd_admission.belongsTo(hims_adm_ip_bed, {
  foreignKey: "bed_id",
  targetKey: "hims_adm_ip_bed_id",
  as: "BED",
});
hims_adm_ip_bed.hasOne(hims_adm_atd_admission, {
  foreignKey: "bed_id",
  as: "BED",
});

hims_adm_atd_admission.belongsTo(hims_adm_ward_header, {
  foreignKey: "ward_id",
  targetKey: "hims_adm_ward_header_id",
  as: "WARD",
});
hims_adm_ward_header.hasOne(hims_adm_atd_admission, {
  foreignKey: "ward_id",
  as: "WARD",
});

hims_adm_atd_admission.belongsTo(hims_f_patient, {
  foreignKey: "patient_id",
  targetKey: "hims_d_patient_id",
  as: "PAT",
});
hims_f_patient.hasOne(hims_adm_atd_admission, {
  foreignKey: "patient_id",
  as: "PAT",
});

export default hims_adm_atd_admission;
