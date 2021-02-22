import mongoose from "mongoose";
let Schema = mongoose.Schema;
let inventoryItemMasterSchema = new Schema({
  item_id: Number,
  document: String,
  filename: String,
  filetype: String,
  updatedDate: Date,
  fromPath: { type: Boolean, default: false },
});

const inventoryItemMasterModal = mongoose.model(
  "algaeh_hims_inventoryItemMaster",
  inventoryItemMasterSchema
);
export default inventoryItemMasterModal;
