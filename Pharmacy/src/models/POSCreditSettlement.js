import algaehMysql from "algaeh-mysql";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import moment from "moment";

export default {
  getPOSCreidtSettlement: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT *, bh.reciept_header_id as cal_receipt_header_id, reciept_amount as receipt_amount \
            FROM hims_f_pos_credit_header bh \
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
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["POS_CRD"],
          table_name: "hims_f_pharmacy_numgen"
        })
        .then(generatedNumbers => {
          pos_credit_number = generatedNumbers.POS_CRD;

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
              req.body.hims_f_pos_credit_header_id = headerResult.insertId
              req.body.pos_credit_number = pos_credit_number
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
  },


  generateAccountingEntry: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      _mysql
        .executeQuery({
          query:
            "select product_type from hims_d_organization where hims_d_organization_id=1 limit 1;\
            SELECT * FROM finance_accounts_maping;",
          printQuery: true
        })
        .then(result => {
          const org_data = result[0];
          if (
            org_data[0]["product_type"] == "HIMS_ERP" ||
            org_data[0]["product_type"] == "FINANCE_ERP"
          ) {

            const cash_in_acc = result[1].find(f => f.account === "CIH_PH")
            const phar_write_off_acc = result[1].find(f => f.account === "PHAR_WF")
            const card_settlement_acc = result[1].find(f => f.account === "CARD_SETTL")
            const pos_criedt_settl_acc = result[1].find(f => f.account === "PHAR_REC")

            _mysql
              .executeQuery({
                query: "INSERT INTO finance_day_end_header (transaction_date, amount, \
                          voucher_type, document_id, document_number, from_screen, \
                          narration, entered_date, entered_by) VALUES (?,?,?,?,?,?,?,?,?)",
                values: [
                  new Date(),
                  inputParam.reciept_amount,
                  "receipt",
                  inputParam.hims_f_pos_credit_header_id,
                  inputParam.pos_credit_number,
                  inputParam.ScreenCode,
                  "Pharmacy Criedt Settlemet " + inputParam.reciept_amount,
                  new Date(),
                  req.userIdentity.algaeh_d_app_user_id
                ],
                printQuery: true
              })
              .then(day_end_header => {
                let insertSubDetail = []
                const month = moment().format("M");
                const year = moment().format("YYYY");
                const IncludeValuess = [
                  "payment_date",
                  "head_id",
                  "child_id",
                  "debit_amount",
                  "payment_type",
                  "credit_amount"
                ];

                console.log("inputParam.write_off_amount", inputParam.write_off_amount)
                // Write off Amount
                if (parseFloat(inputParam.write_off_amount) > 0) {
                  insertSubDetail.push({
                    payment_date: new Date(),
                    head_id: phar_write_off_acc.head_id,
                    child_id: phar_write_off_acc.child_id,
                    debit_amount: inputParam.write_off_amount,
                    payment_type: "DR",
                    credit_amount: 0
                  });
                }
                //Recivable
                insertSubDetail.push({
                  payment_date: new Date(),
                  head_id: pos_criedt_settl_acc.head_id,
                  child_id: pos_criedt_settl_acc.child_id,
                  debit_amount: 0,
                  payment_type: "CR",
                  credit_amount: inputParam.reciept_amount
                });

                for (let i = 0; i < inputParam.receiptdetails.length; i++) {
                  if (inputParam.receiptdetails[i].pay_type === "CA") {
                    //Cash in Hand
                    insertSubDetail.push({
                      payment_date: new Date(),
                      head_id: cash_in_acc.head_id,
                      child_id: cash_in_acc.child_id,
                      debit_amount: inputParam.receiptdetails[i].amount,
                      payment_type: "DR",
                      credit_amount: 0
                    });
                  }
                  if (inputParam.receiptdetails[i].pay_type === "CD") {
                    //Card
                    insertSubDetail.push({
                      payment_date: new Date(),
                      head_id: card_settlement_acc.head_id,
                      child_id: card_settlement_acc.child_id,
                      debit_amount: inputParam.receiptdetails[i].amount,
                      payment_type: "DR",
                      credit_amount: 0
                    });
                  }
                  if (inputParam.receiptdetails[i].pay_type === "CH") {
                    //Cheque To be done
                    insertSubDetail.push({
                      payment_date: new Date(),
                      head_id: cash_in_acc.head_id,
                      child_id: cash_in_acc.child_id,
                      debit_amount: inputParam.receiptdetails[i].amount,
                      payment_type: "DR",
                      credit_amount: 0
                    });
                  }
                }

                _mysql
                  .executeQuery({
                    query:
                      "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                    values: insertSubDetail,
                    includeValues: IncludeValuess,
                    bulkInsertOrUpdate: true,
                    extraValues: {
                      day_end_header_id: day_end_header.insertId,
                      year: year,
                      month: month,
                      hospital_id: req.userIdentity.hospital_id
                    },
                    printQuery: false
                  })
                  .then(subResult => {
                    // _mysql.releaseConnection();
                    next();
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
            next();
          }
        })
        .catch(error => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });

    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  }
};
