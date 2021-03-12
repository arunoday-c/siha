import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";
// import hims_d_services from "./hims_d_services";
// import hims_adm_ward_detail from "./hims_adm_ward_detail";

class hims_adm_bed_status extends Model {}
hims_adm_bed_status.init(
  {
    hims_adm_bed_status_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    bed_color: {
      type: DataTypes.STRING(10),
      //   allowNull: false,
    },
    description: {
      type: DataTypes.STRING(20),
    },
    steps: {
      type: DataTypes.SMALLINT,
    },
    record_status: {
      type: DataTypes.ENUM("A", "I"),
      defaultValue: "A",
    },
    ...userDetails,
  },
  {
    tableName: "hims_adm_bed_status",
    sequelize: db,
    ...dateConversions,
  }
);
(async () => {
  await hims_adm_bed_status.sync({
    alter: true,
  });
})();

// hims_adm_bed_status.belongsTo(hims_d_services, {
//   foreignKey: "services_id",
//   as: "S",
// });
// hims_d_services.hasOne(hims_adm_bed_status, {
//   foreignKey: "services_id",
//   as: "S",
// });

export default hims_adm_bed_status;
