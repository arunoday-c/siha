import mongoose from "mongoose";
let Schema = mongoose.Schema;
let contractSchema = new Schema({
  sub_department_name: String,
  sub_department_id: Number,
  document: String,
  filename: String,
  filetype: String,
  updatedDate: Date,
  fromPath: { type: Boolean, default: false },
});

const subDeptImagesModal = mongoose.model(
  "algaeh_hims_subdeptimages",
  contractSchema
);
export default subDeptImagesModal;
