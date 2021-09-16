import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";
import hims_adm_atd_bed_details from "../dbModels/hims_adm_atd_bed_details";
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
    bed_status: {
      type: DataTypes.ENUM("Booked", "Vacant", "Occupied", "Unavailable"),
      comment:
        "B = Booked \\\\\\\\n V = Vacant\\\\\\n O=Occupied\\\\\n U=Unavailable",
      defaultValue: "Vacant",
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
//   await hims_adm_ward_detail.sync({
//     alter: true,
//   });
// })();
hims_adm_ward_detail.belongsTo(hims_adm_atd_bed_details, {
  foreignKey: "bed_id",
  as: "ABD",
});
hims_adm_atd_bed_details.hasOne(hims_adm_ward_detail, {
  foreignKey: "bed_id",
  as: "ABD",
});

export default hims_adm_ward_detail;
