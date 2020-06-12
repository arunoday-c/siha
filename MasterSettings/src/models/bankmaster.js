import algaehMysql from "algaeh-mysql";
export default {
  addBank_Backup_JAN_23_2020: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    try {
      _mysql
        .executeQuery({
          query:
            "INSERT INTO hims_d_bank (bank_name, bank_code, bank_short_name, address1, contact_person, contact_number, created_date, created_by, updated_date, updated_by)\
                 values(?,?,?,?,?,?,?,?,?,?)",
          values: [
            input.bank_name,
            input.bank_code,
            input.bank_short_name,
            input.address1,
            input.contact_person,
            input.contact_number,
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

  //modified by:irfan to add Bank in finance
  addBank: (req, res, next) => {
    let input = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;"
        })
        .then(result => {
          if (
            result[0]["product_type"] == "HIMS_ERP" ||
            result[0]["product_type"] == "FINANCE_ERP"
          ) {
            const head_id = 25;

            _mysql
              .executeQueryWithTransaction({
                query:
                  "INSERT INTO `finance_account_child` (child_name,head_id,created_from\
                  ,created_date, created_by, updated_date, updated_by)  VALUE(?,?,?,?,?,?,?)",
                values: [
                  input.bank_name,
                  head_id,
                  "S",
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id
                ],
                printQuery: false
              })
              .then(childRes => {
                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO hims_d_bank (bank_name, bank_code, bank_short_name, address1, contact_person,\
                       contact_number, created_date, created_by, updated_date, updated_by,head_id,child_id)\
                         values(?,?,?,?,?,?,?,?,?,?,?,?)",
                    values: [
                      input.bank_name,
                      input.bank_code,
                      input.bank_short_name,
                      input.address1,
                      input.contact_person,
                      input.contact_number,
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date(),
                      req.userIdentity.algaeh_d_app_user_id,
                      head_id,
                      childRes.insertId
                    ],
                    printQuery: true
                  })
                  .then(Result => {
                    _mysql.commitTransaction(() => {
                      _mysql.releaseConnection();
                      req.records = Result;
                      next();
                    });
                  })
                  .catch(error => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              })
              .catch(error => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            _mysql
              .executeQuery({
                query:
                  "INSERT INTO hims_d_bank (bank_name, bank_code, bank_short_name, address1, contact_person, contact_number, created_date, created_by, updated_date, updated_by)\
               values(?,?,?,?,?,?,?,?,?,?)",
                values: [
                  input.bank_name,
                  input.bank_code,
                  input.bank_short_name,
                  input.address1,
                  input.contact_person,
                  input.contact_number,
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
          }
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

  updateBank: (req, res, next) => {
    const _mysql = new algaehMysql();

    let input = req.body;
    try {
      _mysql
        .executeQuery({
          query:
            "update  hims_d_bank  set bank_name=?,bank_code=?,bank_short_name=?,address1=?,contact_person=?,contact_number=?,\
            updated_date=?,updated_by=? where hims_d_bank_id=?",
          values: [
            input.bank_name,
            input.bank_code,
            input.bank_short_name,
            input.address1,
            input.contact_person,
            input.contact_number,
            new Date(),
            req.userIdentity.algaeh_d_app_user_id,
            input.hims_d_bank_id
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

  getBank: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      let strQuery = "";

      if (req.query.active_status != null) {
        strQuery = " and active_status = '" + req.query.active_status + "'";
      }
      _mysql
        .executeQuery({
          query:
            "select   hims_d_bank_id, bank_name, bank_code, bank_short_name,\
           address1, contact_person, contact_number, active_status from\
            hims_d_bank where record_status='A'" +
            strQuery +
            "order by hims_d_bank_id desc "
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

  deleteBank: (req, res, next) => {
    let inputParam = req.body;
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "UPDATE hims_d_bank SET  record_status='I' WHERE hims_d_bank_id=?",
          values: [inputParam.hims_d_bank_id],
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

  getBankCards: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query: "select * from hims_d_bank_card ;"
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
  //created by:IRFAN
  addBankCards: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "select product_type from hims_d_hospital where hims_d_hospital_id=? and \
                (product_type='HIMS_ERP' or product_type='HRMS_ERP' or product_type='FINANCE_ERP');",
          values: [req.userIdentity.hospital_id],
          printQuery: true
        })
        .then(appResult => {
          if (appResult.length > 0) {
            _mysql
              .executeQueryWithTransaction({
                query:
                  "INSERT INTO `finance_account_child` (child_name)  VALUE(?)",
                values: [req.body.card_name],
                printQuery: true
              })
              .then(result => {
                if (result.insertId > 0) {
                  _mysql
                    .executeQuery({
                      query:
                        "INSERT INTO `hims_d_bank_card` (card_name,head_id,child_id)  VALUE(?,?,?)",
                      values: [req.body.card_name, 29, result.insertId],
                      printQuery: true
                    })
                    .then(detail => {
                      _mysql.commitTransaction(() => {
                        _mysql.releaseConnection();
                        req.records = detail;
                        next();
                      });
                    })
                    .catch(e => {
                      _mysql.rollBackTransaction(() => {
                        next(e);
                      });
                    });
                } else {
                  req.records = {
                    invalid_input: true,
                    message: "Please provide valid input"
                  };

                  _mysql.rollBackTransaction(() => {
                    next();
                  });
                }
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(e);
                });
              });
          } else {
            _mysql
              .executeQuery({
                query: "INSERT INTO `hims_d_bank_card` (card_name)  VALUE(?)",
                values: [input.card_name],
                printQuery: true
              })
              .then(detail => {
                _mysql.releaseConnection();
                req.records = detail;
                next();
              })
              .catch(e => {
                _mysql.releaseConnection();
                next(e);
              });
          }
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
