import { DataTypes, Model } from "sequelize";
import db from "../connections/database";

class hims_f_request_download extends Model {}
hims_f_request_download.init(
  {
    hims_f_request_download_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    download_location: {
      type: DataTypes.STRING(500),
    },
    download_link: {
      type: DataTypes.STRING(200),
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    is_notify: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    last_downloaded: {
      type: DataTypes.DATE,
    },
    number_of_download: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    report_title: {
      type: DataTypes.TEXT({ length: "long" }),
    },
    can_download: {
      type: DataTypes.BOOLEAN,
      defaultValue: 0,
    },
    record_status: {
      type: DataTypes.ENUM("A", "I"),
      defaultValue: "I",
    },
  },
  {
    sequelize: db,
    tableName: "hims_f_request_download",
    updatedAt: "update_at",
    createdAt: "created_at",
  }
);
// (async () => {
//   await hims_f_request_download.sync({
//     alter: true,
//   });
// })();
export default hims_f_request_download;
