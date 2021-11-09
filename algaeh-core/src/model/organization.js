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
          "SELECT hims_d_hospital_id, hims_d_hospital_id as hospital_id, hospital_code, local_vat_applicable, default_nationality, default_country, \
          default_currency, default_slot, default_patient_type, standard_from_time, standard_to_time, hospital_name, \
          arabic_hospital_name, hospital_address, city_id, organization_id, effective_start_date, effective_end_date, \
          hosital_status, lab_location_code ,hims_d_currency_id, currency_code, currency_description, currency_symbol,\
          decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator,\
          requied_emp_id FROM hims_d_hospital, hims_d_currency CUR WHERE hims_d_hospital.record_status='A' AND \
          CUR.hims_d_currency_id=default_currency " +
          _stringData,
        values: inputValues,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

let getOrganizationByUser = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    let _stringData = "";
    let inputValues = [];
    if (req.query.hims_d_hospital_id != null) {
      _stringData += " and hims_d_hospital_id=?";
      inputValues.push(req.query.hims_d_hospital_id);
    }
    // req.userIdentity.algaeh_d_app_user_id
    let strQuery = "";
    if (req.userIdentity.role_type === "SU") {
      strQuery =
        "SELECT hims_d_hospital_id,max_users, hospital_code, local_vat_applicable, default_nationality, default_country, \
      default_currency, default_slot, default_patient_type, standard_from_time, standard_to_time, hospital_name, \
      arabic_hospital_name, hospital_address, city_id, organization_id, effective_start_date, effective_end_date, \
      hosital_status, lab_location_code ,hims_d_currency_id, currency_code, currency_description, currency_symbol,\
      decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator,\
      requied_emp_id FROM hims_d_hospital H \
      inner join hims_d_currency CUR on CUR.hims_d_currency_id=H.default_currency and CUR.record_status='A'\
      WHERE H.record_status='A'" +
        _stringData +
        " order by hims_d_hospital_id asc;";
    } else {
      _stringData += " and UE.user_id=?";
      inputValues.push(req.userIdentity.algaeh_d_app_user_id);

      strQuery =
        "SELECT hims_d_hospital_id,max_users, hospital_code, local_vat_applicable, default_nationality, default_country, \
      default_currency, default_slot, default_patient_type, standard_from_time, standard_to_time, hospital_name, \
      arabic_hospital_name, hospital_address, city_id, organization_id, effective_start_date, effective_end_date, \
      hosital_status, lab_location_code ,hims_d_currency_id, currency_code, currency_description, currency_symbol,\
      decimal_places, symbol_position, thousand_separator, decimal_separator, negative_separator,\
      requied_emp_id FROM hims_d_hospital H \
      inner join hims_m_user_employee UE on UE.hospital_id=H.hims_d_hospital_id and UE.record_status='A' \
      inner join hims_d_currency CUR on CUR.hims_d_currency_id=H.default_currency and CUR.record_status='A'\
      WHERE H.record_status='A' " +
        _stringData +
        " order by hims_d_hospital_id asc;";
    }
    _mysql
      .executeQuery({
        query: strQuery,
        values: inputValues,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result;
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
const getMainOrganization = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  try {
    _mysql
      .executeQuery({
        query: `SELECT hims_d_organization.*, hims_d_employee.full_name FROM hims_d_organization LEFT JOIN hims_d_employee ON hims_d_organization.hims_d_head_of_organization_id = hims_d_employee.hims_d_employee_id where hims_d_organization.record_status='A' limit 1;`,
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result[0];
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};

const getActiveUserByHospital = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const input = req.query;
  try {
    _mysql
      .executeQuery({
        query: `SELECT COUNT(*) FROM algaeh_d_app_user USR
        inner join hims_m_user_employee M on M.employee_id=USR.employee_id
        where USR.user_type not in ('SU','EXT') and USR.user_status='A' and M.hospital_id=? and M.login_user='Y';`,
        printQuery: true,
        values: [input.hospital_id],
      })
      .then((result) => {
        _mysql.releaseConnection();
        req.records = result[0]["COUNT(*)"];
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
const updateOrganization = (req, res, next) => {
  const _mysql = new algaehMysql({ path: keyPath });
  const {
    hims_d_organization_id,
    product_type,
    organization_name,
    legal_name,
    business_registration_number,
    fiscal_period,
    fiscal_quarters,
    tax_number,
    country_id,
    phone1,
    phone2,
    email,
    address1,
    address2,
    hims_d_head_of_organization_id,
  } = req.body;
  const { user_type } = req.userIdentity;
  let updateProduct = "";
  if (user_type === "SU") {
    updateProduct = `,product_type='${product_type}'`;
  }
  try {
    _mysql
      .executeQuery({
        query: `update hims_d_organization set organization_name=?,legal_name=?,business_registration_number=?,
        fiscal_period=?,fiscal_quarters=?,tax_number=?,country_id=?,phone1=?,phone2=?,email=?,address1=?,address2=?,hims_d_head_of_organization_id=? ${updateProduct} where hims_d_organization_id=?`,
        values: [
          organization_name,
          legal_name,
          business_registration_number,
          fiscal_period,
          fiscal_quarters,
          tax_number,
          country_id,
          phone1,
          phone2,
          email,
          address1,
          address2,
          hims_d_head_of_organization_id,
          hims_d_organization_id,
        ],
        printQuery: true,
      })
      .then((result) => {
        _mysql.releaseConnection();
        next();
      })
      .catch((error) => {
        _mysql.releaseConnection();
        next(error);
      });
  } catch (e) {
    _mysql.releaseConnection();
    next(e);
  }
};
export default {
  getOrganization,
  getOrganizationByUser,
  getMainOrganization,
  updateOrganization,
  getActiveUserByHospital,
};
