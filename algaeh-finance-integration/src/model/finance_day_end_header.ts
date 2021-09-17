import { DataTypes, Model } from "sequelize";
import db from "../connection/db";
class finance_day_end_header extends Model {}
finance_day_end_header.init(
  {
    finance_day_end_header_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    transaction_date: {
      type: DataTypes.DATEONLY,
    },
    amount: {
      type: DataTypes.DECIMAL(15, 4),
    },
    voucher_type: {
      type: DataTypes.ENUM(
        "journal",
        "contra",
        "receipt",
        "payment",
        "sales",
        "purchase",
        "credit_note",
        "debit_note"
      ),
    },
    document_number: {
      type: DataTypes.STRING(45),
    },
    document_id: {
      type: DataTypes.INTEGER,
    },
    invoice_no: {
      type: DataTypes.STRING(45),
    },
    due_date: {
      type: DataTypes.DATE,
    },

    cancel_transaction: {
      type: DataTypes.ENUM("Y", "N"),
    },
    from_screen: {
      type: DataTypes.STRING(45),
    },
    ref_no: {
      type: DataTypes.STRING(45),
    },
    cheque_date: {
      type: DataTypes.DATE,
    },
    cheque_amount: {
      type: DataTypes.DECIMAL(15, 4),
    },
    narration: {
      type: DataTypes.TEXT,
    },
    entered_by: {
      type: DataTypes.INTEGER,
    },
    posted: {
      type: DataTypes.ENUM("Y", "N"),
    },
    posted_by: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize: db,
    tableName: "finance_day_end_header",
    createdAt: "entered_date",
    updatedAt: "posted_date",
  }
);
export default finance_day_end_header;
