import { DataTypes, Model } from "sequelize";
import db from "../connection/db";
class finance_account_child extends Model {}
finance_account_child.init(
  {
    finance_account_child_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ledger_code: {
      type: DataTypes.STRING(25),
    },
    child_name: {
      type: DataTypes.STRING(75),
    },
    arabic_child_name: {
      type: DataTypes.STRING(75),
    },
    head_id: {
      type: DataTypes.INTEGER,
    },
    created_from: {
      type: DataTypes.ENUM("S", "U"),
    },
    customer_type: {
      type: DataTypes.ENUM("S", "I"),
    },
    created_by: {
      type: DataTypes.INTEGER,
    },
    updated_by: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    createdAt: "created_date",
    updatedAt: "updated_date",
    tableName: "finance_account_child",
  }
);

export default finance_account_child;
