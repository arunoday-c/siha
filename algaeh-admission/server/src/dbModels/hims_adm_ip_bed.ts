import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";
import hims_d_services from "./hims_d_services";
// import hims_adm_ward_detail from "./hims_adm_ward_detail";

class hims_adm_ip_bed extends Model {}
hims_adm_ip_bed.init(
  {
    hims_adm_ip_bed_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bed_desc: {
      type: DataTypes.STRING(50),
      //   allowNull: false,
    },
    bed_status: {
      type: DataTypes.ENUM("A", "I"),
      defaultValue: "A",
    },
    services_id: {
      type: DataTypes.INTEGER,
    },
    hims_d_promo_id: {
      type: DataTypes.INTEGER,
    },
    bed_short_name: {
      type: DataTypes.STRING(10),
      // allowNull:false,
    },
    ...userDetails,
  },
  {
    tableName: "hims_adm_ip_bed",
    sequelize: db,
    ...dateConversions,
  }
);
// (async () => {
//   await hims_adm_ip_bed.sync({
//     // alter: true,
//   });
// })();

hims_adm_ip_bed.belongsTo(hims_d_services, {
  foreignKey: "services_id",
  as: "S",
});
hims_d_services.hasOne(hims_adm_ip_bed, {
  foreignKey: "services_id",
  as: "S",
});

export default hims_adm_ip_bed;
