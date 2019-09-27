import algaehMysql from "algaeh-mysql";
export default {
  addVendorMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_vendor` (vendor_code,vendor_name,bank_name,business_registration_no,email_id_1,email_id_2,website,\
            contact_number,payment_terms,payment_mode,vat_applicable,vat_percentage,  postal_code,address, country_id, state_id, city_id,\
            created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
          values: [
            inputParam.vendor_code,
            inputParam.vendor_name,
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

  updateVendorMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_d_vendor` SET  vendor_name=?,vendor_status=?,business_registration_no=?,email_id_1=?,email_id_2=?,website=?,\
          contact_number=?,payment_terms=?,payment_mode=?,vat_applicable=?,vat_percentage=?,bank_name=?,postal_code=?,address=?, country_id=?, state_id=?, city_id=?,\
          updated_date=?, updated_by=?  WHERE  `record_status`='A' and `hims_d_vendor_id`=?;",
          values: [
            inputParam.vendor_name,
            inputParam.vendor_status,
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
            inputParam.hims_d_vendor_id
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

  getVendorMaster: (req, res, next) => {
    let input = req.query;
    const _mysql = new algaehMysql();

    try {
      let _strAppend = "";
      let inputValues = [];

      if (input.hims_d_vendor_id != null) {
        _strAppend += "and hims_d_vendor_id=?";
        inputValues.push(input.hims_d_vendor_id);
      }
      if (input.vendor_status != null) {
        _strAppend += "and vendor_status=?";
        inputValues.push(input.vendor_status);
      }

      _mysql
        .executeQuery({
          query:
            "select hims_d_vendor_id, vendor_code, vendor_name, vendor_status, business_registration_no, email_id_1,\
          email_id_2, website, contact_number, payment_terms, payment_mode, vat_applicable, vat_percentage, bank_name,\
          postal_code,address, country_id, state_id, city_id from hims_d_vendor where record_status='A' " +
            _strAppend +
            " order by hims_d_vendor_id desc",
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
  },
  deleteVendorMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_vendor SET  record_status='I', `updated_by`=?, `updated_date`=? \
            WHERE  record_status='A' and hims_d_vendor_id=?",
          values: [
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.hims_d_vendor_id
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
  }
};
