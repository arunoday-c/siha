import mongoose from "mongoose";
let Schema = mongoose.Schema;
let contractSchema = new Schema({
  contract_no: String,
  contract_id: Number,
  document: String,
  filename: String,
  filetype: String,
  updatedDate: Date,
  fromPath: { type: Boolean, default: false },
});

const contractModel = mongoose.model("algaeh_hims_contracts", contractSchema);
export default contractModel;
