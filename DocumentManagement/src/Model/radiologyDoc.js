import mongoose from "mongoose";
let Schema = mongoose.Schema;
let radiologySchema = new Schema({
  hims_f_rad_order_id: Number,
  receipt_id: Number,
  document: String,
  filename: String,
  filetype: String,
  updatedDate: Date,
});

const radiologyModal = mongoose.model("algaeh_hims_radiology", radiologySchema);
export default radiologyModal;
