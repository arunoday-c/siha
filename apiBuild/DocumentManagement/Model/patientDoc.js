"use strict";

var _mongoose = require("mongoose");

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var patientSchema = new Schema({
  pageName: String,
  clientID: String,
  image: String,
  destinationName: Object,
  fileExtention: String,
  updatedDate: Date
});

module.exports = _mongoose2.default.model("algaeh_hims_patients", patientSchema);
//# sourceMappingURL=patientDoc.js.map