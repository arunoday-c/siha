import { DataTypes, Model } from "sequelize";
import db from "../connection";
class hims_f_sms_lab extends Model {}
hims_f_sms_lab.init(
  {
    hims_f_sms_lab_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    contact_no: {
      type: DataTypes.STRING(20),
    },
    message: {
      type: DataTypes.STRING(500),
    },
    message_job_id: {
      type: DataTypes.BIGINT,
    },
    message_id: {
      type: DataTypes.STRING,
    },
    part_id: {
      type: DataTypes.INTEGER,
    },
    processed_by: {
      type: DataTypes.STRING(80),
    },
    processed_date_time: {
      type: DataTypes.DATE,
      defaultValue: new Date(),
    },
    error_message: {
      type: DataTypes.STRING(500),
    },
    delivery_status: {
      type: DataTypes.SMALLINT,
      defaultValue: 0,
    },
  },
  {
    sequelize: db,
    tableName: "hims_f_sms_lab",
  }
);
(async () => {
  await hims_f_sms_lab.sync({
    alter: true,
  });
})();

export default hims_f_sms_lab;
