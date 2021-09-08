import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";

// import hims_adm_ward_detail from "./hims_adm_ward_detail";

class hims_adm_atd_bed_details extends Model {}
hims_adm_atd_bed_details.init(
  {
    hims_adm_atd_bed_details_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    admission_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
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

    service_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    services_id: {
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

    insurance_yesno: {
      type: DataTypes.ENUM("N", "Y"),
      defaultValue: "N",
    },

    pre_approval: {
      type: DataTypes.ENUM("N", "Y"),
      defaultValue: "N",
    },
    apprv_status: {
      type: DataTypes.ENUM("NR", "RE", "AP", "RJ"),
      defaultValue: "NR",
    },
    billed: {
      type: DataTypes.ENUM("N", "Y"),
      defaultValue: "N",
    },
    quantity: {
      type: DataTypes.FLOAT,
      defaultValue: "N",
    },

    unit_cost: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    gross_amount: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    discount_amout: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    discount_percentage: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    net_amout: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    copay_percentage: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    copay_amount: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    deductable_amount: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    deductable_percentage: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    tax_inclusive: {
      type: DataTypes.ENUM("N", "Y"),
      defaultValue: "N",
    },
    patient_resp: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    comapany_resp: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    patient_tax: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    company_tax: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    patient_payable: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    company_payble: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    total_tax: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: true,
    },
    hospital_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

    ...userDetails,
  },
  {
    tableName: "hims_adm_atd_bed_details",
    sequelize: db,
    ...dateConversions,
  }
);
// (async () => {
//   await hims_adm_atd_bed_details.sync({
//     alter: true,
//   });
// })();
export default hims_adm_atd_bed_details;
