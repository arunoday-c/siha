import mongoose from "mongoose";
let Schema = mongoose.Schema;
let uploadDocumentSchema = new Schema({
  doc_number: String || Number,
  document: String,
  filename: String,
  filetype: String,
  updatedDate: Date,
  fromPath: { type: Boolean, default: false },
});

const uploadDocumentModal = mongoose.model(
  "algaeh_hims_documents_folder",
  uploadDocumentSchema
);
export default uploadDocumentModal;
