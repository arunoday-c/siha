import { DataTypes, Model } from "sequelize";
import db from "../connection";
import { dateConversions, userDetails } from "./common";
import hims_d_services from "./hims_d_services";

class hims_d_cpt_code extends Model {}
hims_d_cpt_code.init(
  {
    hims_d_cpt_code_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    cpt_code: {
      type: DataTypes.STRING(20),
      //   allowNull: false,
      unique: true,
    },
    cpt_desc: {
      type: DataTypes.STRING(90),
      //   defaultValue: "A",
    },
    long_cpt_desc: {
      type: DataTypes.STRING(160),
    },
    prefLabel: {
      type: DataTypes.STRING(300),
    },
    cpt_status: {
      type: DataTypes.ENUM("A", "I"),
      // allowNull:false,
      defaultValue: "A",
    },
    record_status: {
      type: DataTypes.ENUM("A", "I"),
      // allowNull:false,
      defaultValue: "A",
    },

    ...userDetails,
  },
  {
    tableName: "hims_d_cpt_code",
    sequelize: db,
    ...dateConversions,
  }
);
(async () => {
  await hims_d_cpt_code.sync({
    alter: true,
  });
})();
hims_d_services.belongsTo(hims_d_cpt_code, {
  foreignKey: "cpt_code",
  as: "CPT",
});
hims_d_cpt_code.hasOne(hims_d_services, {
  foreignKey: "cpt_code",
  as: "CPT",
});
export default hims_d_cpt_code;
