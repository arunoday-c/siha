import algaehMysql from "algaeh-mysql";
export default {
  addCompanyAccount: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_d_company_account (employer_cr_no,payer_cr_no,bank_id,bank_short_name,account_number,created_date,created_by,updated_date,updated_by)\
                 values(?,?,?,?,?,?,?,?,?)",
          values: [
            input.employer_cr_no,
            input.payer_cr_no,
            input.bank_id,
            input.bank_short_name,
            input.account_number,

            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id
          ]
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

  //created by irfan: to get
  getCompanyAccount: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select  hims_d_company_account_id,employer_cr_no,payer_cr_no,bank_id,CA.bank_short_name,account_number, \
            B.bank_name from hims_d_company_account CA, hims_d_bank B where CA.record_status='A' and \
            B.hims_d_bank_id = CA.bank_id order by hims_d_company_account_id desc "
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

  //created by irfan: to
  updateCompanyAccount: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    try {
      _mysql
        .executeQuery({
          query:
            "update  hims_d_company_account  set employer_cr_no=?,payer_cr_no=?,bank_id=?,bank_short_name=?,account_number=? ,updated_date=?,updated_by=?\
            WHERE  `record_status`='A' and `hims_d_company_account_id`=?;",
          values: [
            input.employer_cr_no,
            input.payer_cr_no,
            input.bank_id,
            input.bank_short_name,
            input.account_number,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_company_account_id
          ]
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
  deleteCompanyAccount: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_company_account SET  record_status='I' WHERE hims_d_company_account_id=?",
          values: [inputParam.hims_d_company_account_id],
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
