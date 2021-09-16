import { DataTypes, Model } from "sequelize";
import db from "../connection/db";
class finance_account_head extends Model {}
finance_account_head.init(
  {
    finance_account_head_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    account_code: {
      type: DataTypes.STRING(45),
    },
    account_name: {
      type: DataTypes.STRING(75),
    },
    arabic_account_name: {
      type: DataTypes.STRING(75),
    },
    account_parent: {
      type: DataTypes.STRING(45),
    },
    group_type: {
      type: DataTypes.ENUM("P", "C"),
    },
    account_level: {
      type: DataTypes.TINYINT,
    },
    created_from: {
      type: DataTypes.ENUM("S", "U"),
    },
    account_type: {
      type: DataTypes.ENUM(
        "B",
        "C",
        "PL",
        "N",
        "AR",
        "CA",
        "NCA",
        "CACE",
        "CL",
        "NCL",
        "EQTY"
      ),
    },
    sort_order: {
      type: DataTypes.TINYINT,
    },
    parent_acc_id: {
      type: DataTypes.INTEGER,
    },
    hierarchy_path: {
      type: DataTypes.STRING(45),
    },
    root_id: {
      type: DataTypes.TINYINT,
    },
    group_code: {
      type: DataTypes.STRING(45),
    },
    is_cos_account: {
      type: DataTypes.ENUM("Y", "N"),
    },
    group_parent: {
      type: DataTypes.STRING(45),
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
    tableName: "finance_account_head",
  }
);

export default finance_account_head;
