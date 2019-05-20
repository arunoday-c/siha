import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

module.exports = {
  getPOSCreidtSettlement: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT *, bh.reciept_header_id as cal_receipt_header_id FROM hims_f_pos_credit_header bh \
          inner join hims_f_patient as PAT on bh.patient_id = PAT.hims_d_patient_id \
          where  bh.pos_credit_number='" +
            req.query.pos_credit_number +
            "'",
          printQuery: true
        })
        .then(headerResult => {
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_pos_credit_detail bh inner join hims_f_pharmacy_pos_header as pos on \
                bh.pos_header_id = pos.hims_f_pharmacy_pos_header_id where pos_credit_header_id=?",
                values: [headerResult[0].hims_f_pos_credit_header_id],
                printQuery: true
              })
              .then(criedtdetails => {
                _mysql.releaseConnection();
                req.records = {
                  ...headerResult[0],
                  ...{ criedtdetails },
                  ...{
                    hims_f_receipt_header_id:
                      headerResult[0].cal_receipt_header_id
                  }
                };
                next();
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            _mysql.releaseConnection();
            req.records = headerResult;
            next();
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

  addPOSCreidtSettlement: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);

    try {
      let inputParam = { ...req.body };
      inputParam.reciept_header_id = req.records.receipt_header_id;
      inputParam.hospital_id = 1;
      let pos_credit_number = "";

      const utilities = new algaehUtilities();
      utilities.logger().log("addPOSCreidtSettlement: ");

      _mysql
        .generateRunningNumber({
          modules: ["POS_CRD"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity["x-branch"]
          }
        })
        .then(generatedNumbers => {
          pos_credit_number = generatedNumbers[0];

          _mysql
            .executeQuery({
              query:
                "INSERT INTO hims_f_pos_credit_header ( pos_credit_number, pos_credit_date, patient_id, reciept_amount, write_off_amount,\
                hospital_id,recievable_amount, remarks, reciept_header_id,transaction_type, write_off_account,\
                created_by, created_date) \
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                pos_credit_number,
                inputParam.pos_credit_date != null
                  ? new Date(inputParam.pos_credit_date)
                  : inputParam.pos_credit_date,
                inputParam.patient_id,
                inputParam.reciept_amount,
                inputParam.write_off_amount,
                inputParam.hospital_id,
                inputParam.recievable_amount,
                inputParam.remarks,
                inputParam.reciept_header_id,
                inputParam.transaction_type,
                inputParam.write_off_account,
                req.userIdentity.algaeh_d_app_user_id,
                new Date()
              ],
              printQuery: true
            })
            .then(headerResult => {
              utilities.logger().log("headerResult: ", headerResult.insertId);
              let IncludeValues = [
                "pos_header_id",
                "include",
                "bill_date",
                "credit_amount",
                "receipt_amount",
                "balance_amount",
                "previous_balance",
                "bill_amount"
              ];

              _mysql
                .executeQuery({
                  query: "INSERT INTO hims_f_pos_credit_detail(??) VALUES ?",
                  values: inputParam.criedtdetails,
                  includeValues: IncludeValues,
                  extraValues: {
                    pos_credit_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(detailResult => {
                  utilities.logger().log("detailResult: ", detailResult);
                  //   _mysql.commitTransaction(() => {
                  //     _mysql.releaseConnection();
                  req.records = {
                    pos_credit_number: pos_credit_number,
                    hims_f_pos_credit_header_id: headerResult.insertId,
                    receipt_number: req.records.receipt_number
                  };
                  next();
                  //   });
                })
                .catch(error => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            })
            .catch(e => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  updatePOSBilling: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updatePOSBilling: ");
      let inputParam = { ...req.body };

      let details = inputParam.criedtdetails;
      let qry = "";
      for (let i = 0; i < details.length; i++) {
        let balance_credit =
          details[i].previous_balance - details[i].receipt_amount;

        qry += mysql.format(
          " UPDATE `hims_f_pharmacy_pos_header` SET balance_credit= ? WHERE hims_f_pharmacy_pos_header_id=?;",
          [balance_credit, details[i].pos_header_id]
        );
      }

      _mysql
        .executeQueryWithTransaction({
          query: qry,
          printQuery: true
        })
        .then(result => {
          utilities.logger().log("result: ", result);
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.data = result;
            next();
          });
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  getPatientPOSCriedt: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("getPatientPOSCriedt: ");

      _mysql
        .executeQuery({
          query:
            "SELECT * from hims_f_pharmacy_pos_header WHERE record_status='A' AND balance_credit > 0 AND \
            patient_id=? order by hims_f_pharmacy_pos_header_id desc",
          values: [req.query.patient_id],
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
          reject(error);
        });
    } catch (e) {
      _mysql.releaseConnection();
      next(e);
    }
  }
};
