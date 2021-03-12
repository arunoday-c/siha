import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";
import hims_d_cpt_code from "./hims_d_cpt_code";
class hims_d_services extends Model {}
hims_d_services.init(
  {
    hims_d_services_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    service_code: {
      type: DataTypes.STRING(45),
      //   allowNull: false,
    },
    cpt_code: {
      type: DataTypes.STRING(20),
      //   defaultValue: "A",
    },
    service_name: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    arabic_service_name: {
      type: DataTypes.STRING(300),
    },
    service_desc: {
      type: DataTypes.STRING(1000),
    },
    sub_department_id: {
      type: DataTypes.INTEGER,
    },
    hospital_id: {
      type: DataTypes.INTEGER,
    },
    service_type_id: {
      type: DataTypes.INTEGER,
    },
    procedure_type: {
      type: DataTypes.ENUM("DN", "GN"),
      allowNull: false,
      defaultValue: "GN",
    },
    standard_fee: {
      type: DataTypes.DECIMAL(10, 2),

      defaultValue: 0.0,
    },
    followup_free_fee: {
      type: DataTypes.DECIMAL(10, 2),

      defaultValue: 0.0,
    },
    followup_paid_fee: {
      type: DataTypes.DECIMAL(10, 2),

      defaultValue: 0.0,
    },

    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.0,
    },
    vat_applicable: {
      type: DataTypes.ENUM("Y", "N"),
      allowNull: false,
      defaultValue: "N",
    },
    vat_percent: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0.0,
    },
    service_status: {
      type: DataTypes.ENUM("A", "I"),
      allowNull: false,
      defaultValue: "A",
    },
    effective_start_date: {
      type: DataTypes.STRING(45),
      defaultValue: "1900-01-01",
    },
    effectice_end_date: {
      type: DataTypes.STRING(45),
      defaultValue: "9999-12-31",
    },
    physiotherapy_service: {
      type: DataTypes.ENUM("N", "Y"),
      allowNull: false,
      defaultValue: "N",
    },
    head_account: {
      type: DataTypes.STRING(45),
    },
    head_id: {
      type: DataTypes.INTEGER,
    },
    child_id: {
      type: DataTypes.INTEGER,
    },
    record_status: {
      type: DataTypes.ENUM("A", "I"),
      defaultValue: "A",
    },

    ...userDetails,
  },
  {
    tableName: "hims_d_services",
    sequelize: db,
    ...dateConversions,
  }
);
(async () => {
  await hims_d_services.sync({
    alter: true,
  });
})();

export default hims_d_services;
