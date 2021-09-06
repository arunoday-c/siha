import { DataTypes, Model } from "sequelize";
import db from "../connection";
class hims_f_ip_numgen extends Model {}

hims_f_ip_numgen.init(
  {
    hims_f_ip_numgen_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    numgen_code: {
      type: DataTypes.STRING(45),
      unique: true,
      allowNull: false,
    },
    module_desc: {
      type: DataTypes.STRING(200),
    },
    prefix: {
      type: DataTypes.STRING(45),
    },
    intermediate_series: {
      type: DataTypes.STRING(45),
    },
    postfix: {
      type: DataTypes.STRING(45),
    },
    length: {
      type: DataTypes.INTEGER,
    },
    numgen_seperator: {
      type: DataTypes.STRING(5),
    },
    postfix_start: {
      type: DataTypes.STRING(200),
    },
    postfix_end: {
      type: DataTypes.STRING(200),
    },
    current_num: {
      type: DataTypes.STRING(200),
    },
    pervious_num: {
      type: DataTypes.STRING(200),
    },
    increment_by: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    preceding_zeros_req: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
    },
    intermediate_series_req: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
    },
    reset_slno_on_year_change: {
      type: DataTypes.ENUM("Y", "N"),
      defaultValue: "Y",
    },
    record_status: {
      type: DataTypes.ENUM("A", "I"),
      defaultValue: "A",
    },
  },
  {
    sequelize: db,
    tableName: "hims_f_ip_numgen",
  }
);
(async () => {
  await hims_f_ip_numgen.sync({
    alter: true,
  });
})();

export default hims_f_ip_numgen;
