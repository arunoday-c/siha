"use strict";

var _utils = require("../utils");

var _extend = require("extend");

var _extend2 = _interopRequireDefault(_extend);

var _httpStatus = require("../utils/httpStatus");

var _httpStatus2 = _interopRequireDefault(_httpStatus);

var _logging = require("../utils/logging");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getOrganization = function getOrganization(req, res, next) {
  var labSection = {
    hims_d_hospital_id: "ALL"
  };
  try {
    if (req.db == null) {
      next(_httpStatus2.default.dataBaseNotInitilizedError());
    }
    var pagePaging = "";
    if (req.paging != null) {
      var Page = paging(req.paging);
      pagePaging += " LIMIT " + Page.pageNo + "," + page.pageSize;
    }

    var condition = (0, _utils.whereCondition)((0, _extend2.default)(labSection, req.query));
    (0, _utils.selectStatement)({
      db: req.db,
      query: "SELECT hims_d_hospital_id, hospital_code, local_vat_applicable, default_nationality, default_country, \
          default_currency, default_slot, default_patient_type, standard_from_time, standard_to_time, hospital_name, \
          arabic_hospital_name, hospital_address, city_id, organization_id, effective_start_date, effective_end_date, \
          hosital_status, lab_location_code ,hims_d_currency_id, currency_code, currency_description, currency_symbol,\
          decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator FROM \
          hims_d_hospital, hims_d_currency CUR WHERE hims_d_hospital.record_status='A' AND \
          CUR.hims_d_currency_id=default_currency AND " + condition.condition + " " + pagePaging,
      values: condition.values
    }, function (result) {
      req.records = result;
      next();
    }, function (error) {
      next(error);
    }, true);
  } catch (e) {
    next(e);
  }
};

module.exports = {
  getOrganization: getOrganization
};
//# sourceMappingURL=organization.js.map