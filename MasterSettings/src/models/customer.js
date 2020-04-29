import algaehMysql from "algaeh-mysql";
export default {
  addCustomerMasterBAKP_JAN_2020: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO `hims_d_customer` (customer_code,customer_name,bank_name,business_registration_no,email_id_1,email_id_2,website,\
            contact_number,payment_terms,payment_mode,postal_code,address, country_id, state_id, city_id,\
            purchase_inch_name, purchase_inch_number,purchase_inch_emailid, project_inch_name, \
            project_inch_number, project_inch_emailid, finance_inch_name, finance_inch_number, finance_inch_emailid, \
            created_date, created_by, updated_date, updated_by)\
              VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
            inputParam.postal_code,
            inputParam.address,
            inputParam.country_id,
            inputParam.state_id,
            inputParam.city_id,
            inputParam.purchase_inch_name,
            inputParam.purchase_inch_number,
            inputParam.purchase_inch_emailid,
            inputParam.project_inch_name,
            inputParam.project_inch_number,
            inputParam.project_inch_emailid,
            inputParam.finance_inch_name,
            inputParam.finance_inch_number,
            inputParam.finance_inch_emailid,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
          ],
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
  },

  //modified by:irfan to
  addCustomerMaster: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;\
            select finance_account_head_id from finance_account_head where account_code='1.2.3.2';",
        })
        .then((result) => {
          if (
            result[0][0]["product_type"] == "HIMS_ERP" ||
            result[0][0]["product_type"] == "FINANCE_ERP"
          ) {
            const head_id = result[1][0]["finance_account_head_id"];

            _mysql
              .executeQueryWithTransaction({
                query:
                  "INSERT INTO `finance_account_child` (child_name,head_id,created_from\
                      ,created_date, created_by, updated_date, updated_by)  VALUE(?,?,?,?,?,?,?)",
                values: [
                  inputParam.customer_name,
                  head_id,
                  "S",
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                ],
                printQuery: false,
              })
              .then((childRes) => {
                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO `hims_d_customer` (customer_code,customer_name,bank_name,business_registration_no,email_id_1,email_id_2,website,\
              contact_number,payment_terms,payment_mode,postal_code,address, country_id, state_id, city_id,\
              purchase_inch_name, purchase_inch_number,purchase_inch_emailid, project_inch_name, \
              project_inch_number, project_inch_emailid, finance_inch_name, finance_inch_number, finance_inch_emailid, \
              created_date, created_by, updated_date, updated_by,head_id,child_id)\
                VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
                      inputParam.postal_code,
                      inputParam.address,
                      inputParam.country_id,
                      inputParam.state_id,
                      inputParam.city_id,
                      inputParam.purchase_inch_name,
                      inputParam.purchase_inch_number,
                      inputParam.purchase_inch_emailid,
                      inputParam.project_inch_name,
                      inputParam.project_inch_number,
                      inputParam.project_inch_emailid,
                      inputParam.finance_inch_name,
                      inputParam.finance_inch_number,
                      inputParam.finance_inch_emailid,
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                      head_id,
                      childRes.insertId,
                    ],
                    printQuery: true,
                  })
                  .then((Custresult) => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = Custresult;
                      next();
                    });
                  })
                  .catch((error) => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            _mysql
              .executeQuery({
                query:
                  "INSERT INTO `hims_d_customer` (customer_code,customer_name,bank_name,business_registration_no,email_id_1,email_id_2,website,\
          contact_number,payment_terms,payment_mode,postal_code,address, country_id, state_id, city_id,\
          purchase_inch_name, purchase_inch_number,purchase_inch_emailid, project_inch_name, \
          project_inch_number, project_inch_emailid, finance_inch_name, finance_inch_number, finance_inch_emailid, \
          created_date, created_by, updated_date, updated_by)\
            VALUE(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
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
                  inputParam.postal_code,
                  inputParam.address,
                  inputParam.country_id,
                  inputParam.state_id,
                  inputParam.city_id,
                  inputParam.purchase_inch_name,
                  inputParam.purchase_inch_number,
                  inputParam.purchase_inch_emailid,
                  inputParam.project_inch_name,
                  inputParam.project_inch_number,
                  inputParam.project_inch_emailid,
                  inputParam.finance_inch_name,
                  inputParam.finance_inch_number,
                  inputParam.finance_inch_emailid,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                ],
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
          }
        })
        .catch((error) => {
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
            "UPDATE `hims_d_customer` SET  customer_name=?,customer_status=?,business_registration_no=?, \
            email_id_1=?,email_id_2=?,website=?, contact_number=?,payment_terms=?,payment_mode=?,bank_name=?,\
            postal_code=?,address=?, country_id=?, state_id=?, city_id=?, purchase_inch_name=?, \
            purchase_inch_number=?, purchase_inch_emailid=? , project_inch_name=?, project_inch_number=?, \
            project_inch_emailid=?, finance_inch_name=?, finance_inch_number=?, finance_inch_emailid=?,\
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
            inputParam.bank_name,
            inputParam.postal_code,
            inputParam.address,
            inputParam.country_id,
            inputParam.state_id,
            inputParam.city_id,
            inputParam.purchase_inch_name,
            inputParam.purchase_inch_number,
            inputParam.purchase_inch_emailid,
            inputParam.project_inch_name,
            inputParam.project_inch_number,
            inputParam.project_inch_emailid,
            inputParam.finance_inch_name,
            inputParam.finance_inch_number,
            inputParam.finance_inch_emailid,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            inputParam.hims_d_customer_id,
          ],
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
          email_id_2, website, contact_number, payment_terms, payment_mode, bank_name, \
          purchase_inch_name, purchase_inch_number,purchase_inch_emailid, project_inch_name, \
          project_inch_number, project_inch_emailid, finance_inch_name, finance_inch_number, finance_inch_emailid,\
          postal_code,address, country_id, state_id, city_id from hims_d_customer where record_status='A' " +
            _strAppend +
            " order by hims_d_customer_id desc",
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
  },
};
