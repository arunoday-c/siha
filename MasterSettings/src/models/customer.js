import algaehMysql from "algaeh-mysql";
export default {
  addCustomerMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_customer` (customer_code,customer_name,bank_name,business_registration_no,email_id_1,email_id_2,website,\
            contact_number,payment_terms,payment_mode,vat_applicable,vat_percentage,  postal_code,address, country_id, state_id, city_id,\
            created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.customer_code,
            inputParam.customer_name,
            inputParam.bank_name,
            inputParam.business_registration_no,
            inputParam.email_id_1,
            inputParam.email_id_2,
            inputParam.website,
            inputParam.contact_number,
            inputParam.payment_terms,
            inputParam.payment_mode,
            inputParam.vat_applicable,
            inputParam.vat_percentage,
            inputParam.postal_code,
            inputParam.address,
            inputParam.country_id,
            inputParam.state_id,
            inputParam.city_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ],
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
  },

  updateCustomerMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_customer` SET  customer_name=?,customer_status=?,business_registration_no=?,email_id_1=?,email_id_2=?,website=?,\
          contact_number=?,payment_terms=?,payment_mode=?,vat_applicable=?,vat_percentage=?,bank_name=?,postal_code=?,address=?, country_id=?, state_id=?, city_id=?,\
          updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_customer_id`=?;",
          values: [
            inputParam.customer_name,
            inputParam.customer_status,
            inputParam.business_registration_no,
            inputParam.email_id_1,
            inputParam.email_id_2,
            inputParam.website,
            inputParam.contact_number,
            inputParam.payment_terms,
            inputParam.payment_mode,
            inputParam.vat_applicable,
            inputParam.vat_percentage,
            inputParam.bank_name,
            inputParam.postal_code,
            inputParam.address,
            inputParam.country_id,
            inputParam.state_id,
            inputParam.city_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_d_customer_id
          ],
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
  },

  getCustomerMaster: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_customer_id != null) {
        _strAppend += "and hims_d_customer_id=?";
        inputValues.push(input.hims_d_customer_id);
      }
      if (input.customer_status != null) {
        _strAppend += "and customer_status=?";
        inputValues.push(input.customer_status);
      }

      _mysql
        .executeQuery({
          query:
            "select hims_d_customer_id, customer_code, customer_name, customer_status, business_registration_no, email_id_1,\
          email_id_2, website, contact_number, payment_terms, payment_mode, vat_applicable, vat_percentage, bank_name,\
          postal_code,address, country_id, state_id, city_id from hims_d_customer where record_status='A' " +
            _strAppend +
            " order by hims_d_customer_id desc",
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
  }
};
