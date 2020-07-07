import mongoose from "mongoose";
let Schema = mongoose.Schema;
let contractSchema = new Schema({
  serial_no: String,
  invoice_id: Number,
  document: String,
  filename: String,
  filetype: String,
  updatedDate: Date,
});

const contractModel = mongoose.model("algaeh_hims_invoices", contractSchema);
export default contractModel;
