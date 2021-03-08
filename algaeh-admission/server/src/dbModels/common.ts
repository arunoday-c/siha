import { DataTypes } from "sequelize";

export const userDetails = {
  created_by: {
    type: DataTypes.INTEGER,
  },
  updated_by: {
    type: DataTypes.INTEGER,
  },
};
export const dateConversions = {
  createdAt: "created_date",
  updatedAt: "updated_date",
};
