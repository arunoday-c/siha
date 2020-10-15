import mongoose from "mongoose";
let Schema = mongoose.Schema;
let contractSchema = new Schema({
  grn_number: String,
  receipt_id: Number,
  document: String,
  filename: String,
  filetype: String,
  updatedDate: Date,
});

const contractModel = mongoose.model("algaeh_hims_receipts", contractSchema);
export default contractModel;
