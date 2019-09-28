import algaehMysql from "algaeh-mysql";
const keyPath = require("algaeh-keys/keys");

let getOrganization = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.hims_d_hospital_id != null) {
      _stringData += " and hims_d_hospital_id=?";
      inputValues.push(req.query.hims_d_hospital_id);
    }
    _mysql
      .executeQuery({
        query:
          "SELECT hims_d_hospital_id, hospital_code, local_vat_applicable, default_nationality, default_country, \
          default_currency, default_slot, default_patient_type, standard_from_time, standard_to_time, hospital_name, \
          arabic_hospital_name, hospital_address, city_id, organization_id, effective_start_date, effective_end_date, \
          hosital_status, lab_location_code ,hims_d_currency_id, currency_code, currency_description, currency_symbol,\
          decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator,\
          requied_emp_id FROM hims_d_hospital, hims_d_currency CUR WHERE hims_d_hospital.record_status='A' AND \
          CUR.hims_d_currency_id=default_currency " +
          _stringData,
        values: inputValues,
        printQuery: true
      })
      .then(result => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch(error => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

export default {
  getOrganization
};
