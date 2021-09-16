import { DataTypes, Model } from "sequelize";
import db from "../connection/db";
import finance_account_child from "./finance_account_child";
import finance_day_end_header from "./finance_day_end_header";
class finance_day_end_sub_detail extends Model {}
finance_day_end_sub_detail.init(
  {
    finance_day_end_sub_detail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    day_end_header_id: {
      type: DataTypes.INTEGER,
    },
    month: {
      type: DataTypes.TINYINT,
    },
    year: {
      type: DataTypes.SMALLINT,
    },
    payment_date: {
      type: DataTypes.DATE,
    },
    head_id: {
      type: DataTypes.INTEGER,
    },
    child_id: {
      type: DataTypes.INTEGER,
    },
    debit_amount: {
      type: DataTypes.DECIMAL(15, 4),
    },
    payment_type: {
      type: DataTypes.ENUM("DR", "CR"),
    },
    credit_amount: {
      type: DataTypes.DECIMAL(15, 4),
    },
    hospital_id: {
      type: DataTypes.INTEGER,
    },
    project_id: {
      type: DataTypes.INTEGER,
    },
    sub_department_id: {
      type: DataTypes.INTEGER,
    },

    reverted: {
      type: DataTypes.ENUM("Y", "N"),
    },
  },
  {
    sequelize: db,
    tableName: "finance_day_end_sub_detail",
    createdAt: false,
    updatedAt: false,
  }
);

finance_day_end_sub_detail.belongsTo(finance_account_child, {
  as: "child_account",
  foreignKey: "child_id",
});

finance_day_end_header.hasMany(finance_day_end_sub_detail, {
  as: "day_end_details",
  foreignKey: "day_end_header_id",
});

export default finance_day_end_sub_detail;
