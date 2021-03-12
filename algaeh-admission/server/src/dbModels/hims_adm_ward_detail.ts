import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";
// import hims_adm_ward_header from "./hims_adm_ward_header";
// import hims_adm_ip_bed from "./hims_adm_ip_bed";

class hims_adm_ward_detail extends Model {}
hims_adm_ward_detail.init(
  {
    hims_adm_ward_detail_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ward_header_id: {
      type: DataTypes.INTEGER,
      //   allowNull: false,
    },
    bed_id: {
      type: DataTypes.INTEGER,
    },
    bed_no: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM("A", "I"),
      comment: "A = Active \\\\n I = Inactive",
    },

    ...userDetails,
  },
  {
    tableName: "hims_adm_ward_detail",
    sequelize: db,
    ...dateConversions,
  }
);
// (async () => {
//   await hims_adm_ip_bed.sync({
//     // alter: true,
//   });
// })();

export default hims_adm_ward_detail;
