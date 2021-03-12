import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";
import hims_adm_ward_detail from "./hims_adm_ward_detail";
import hims_adm_ip_bed from "./hims_adm_ip_bed";

class hims_adm_ward_header extends Model {}
hims_adm_ward_header.init(
  {
    hims_adm_ward_header_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ward_desc: {
      type: DataTypes.STRING(50),
      //   allowNull: false,
    },
    ward_status: {
      type: DataTypes.ENUM("A", "I"),
      defaultValue: "A",
    },
    ward_short_name: {
      type: DataTypes.STRING(10),
    },
    ward_type: {
      type: DataTypes.ENUM("M", "F", "P", "N", "G", "I", "l"),
      comment:
        "M = Male \\\\n F = Female \\\n P = Pediatric \\\n N = Neonatal \\\n G = General \\\n I= Intensive \\\n l= Labour",
    },

    ...userDetails,
  },
  {
    tableName: "hims_adm_ward_header",
    sequelize: db,
    ...dateConversions,
  }
);
(async () => {
  await hims_adm_ward_header.sync({
    alter: true,
  });
})();

hims_adm_ward_header.hasMany(hims_adm_ward_detail, {
  foreignKey: "ward_header_id",
  // constraints: false,
  // scope: {
  //   ward_header_id: "hims_adm_ward_header_id",
  // },
  as: "WD",
});
hims_adm_ward_detail.belongsTo(hims_adm_ward_header, {
  foreignKey: "ward_header_id",
  // constraints: false,
  as: "WD",
});
// hims_adm_ip_bed.hasOne(hims_adm_ward_detail, {
//   foreignKey: "bed_id",
// });
// hims_adm_ward_header.belongsToMany(hims_adm_ward_detail, {
//   through: "hims_adm_ip_bed",
//   foreignKey: "bed_id",
//   as: "IpBed",
// });
hims_adm_ward_detail.belongsTo(hims_adm_ip_bed, {
  foreignKey: "bed_id",
  constraints: false,
  as: "IP",
});
hims_adm_ip_bed.hasMany(hims_adm_ward_detail, {
  foreignKey: "bed_id",
  constraints: false,
  as: "WD",
});
hims_adm_ward_header.belongsToMany(hims_adm_ip_bed, {
  through: {
    model: hims_adm_ward_detail,
    unique: false,
  },
  foreignKey: "ward_header_id",

  as: "WH",
});
// hims_adm_ward_detail.belongsToMany(hims_adm_ward_header, {
//   through: "ward_header_id",
// });
// hims_adm_ward_header.belongsToMany(hims_adm_ward_detail, {
//   through: "ward_header_id",
// });

export default hims_adm_ward_header;
