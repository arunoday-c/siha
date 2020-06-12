import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import moment from "moment";

export default {
  addCreidtSettlement: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      let credit_number = "";

      const utilities = new algaehUtilities();
      utilities.logger().log("addCreidtSettlement: ");

      inputParam.reciept_header_id =
        req.records === undefined
          ? input.receipt_header_id
          : req.records.receipt_header_id;
      utilities
        .logger()
        .log("receipt_header_id: ", inputParam.reciept_header_id);

      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["OP_CRD"],
          table_name: "hims_f_app_numgen"
        })
        .then(generatedNumbers => {
          credit_number = generatedNumbers.OP_CRD;

          _mysql
            .executeQuery({
              query:
                "INSERT INTO hims_f_credit_header ( credit_number, credit_date, patient_id, reciept_amount, write_off_amount,\
                hospital_id,recievable_amount, remarks, reciept_header_id,transaction_type, write_off_account,\
                created_by, created_date) \
                VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                credit_number,
                inputParam.credit_date != null
                  ? new Date(inputParam.credit_date)
                  : inputParam.credit_date,
                inputParam.patient_id,
                inputParam.reciept_amount,
                inputParam.write_off_amount,
                req.userIdentity.hospital_id,
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
              let IncludeValues = [
                "bill_header_id",
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
                  query: "INSERT INTO hims_f_credit_detail(??) VALUES ?",
                  values: inputParam.criedtdetails,
                  includeValues: IncludeValues,
                  extraValues: {
                    credit_header_id: headerResult.insertId
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(leave_detail => {
                  //   _mysql.commitTransaction(() => {
                  //     _mysql.releaseConnection();
                  req.records = {
                    credit_number: credit_number,
                    hims_f_credit_header_id: headerResult.insertId,
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

  getCreidtSettlement: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT *, bh.reciept_header_id as cal_receipt_header_id FROM hims_f_credit_header bh \
          inner join hims_f_patient as PAT on bh.patient_id = PAT.hims_d_patient_id \
          where  bh.credit_number='" +
            req.query.credit_number +
            "'",

          printQuery: true
        })
        .then(headerResult => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          if (headerResult.length > 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_credit_detail bh inner join hims_f_billing_header as bill on \
                bh.bill_header_id = bill.hims_f_billing_header_id where credit_header_id=?",
                values: [headerResult[0].hims_f_credit_header_id],
                printQuery: true
              })
              .then(criedtdetails => {
                // _mysql.releaseConnection();

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
                console.log("error:", error);
                _mysql.releaseConnection();
                next(error);
              });
          } else {
            req.records = headerResult;
            _mysql.releaseConnection();
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

  updateOPBilling: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      const utilities = new algaehUtilities();
      utilities.logger().log("updateOPBilling: ");
      let inputParam = { ...req.body };

      utilities.logger().log("inputParam: ", inputParam.criedtdetails);

      let details = inputParam.criedtdetails;
      let qry = "";
      utilities.logger().log("updateOPBilling: ");
      for (let i = 0; i < details.length; i++) {
        let balance_credit =
          details[i].previous_balance - details[i].receipt_amount;
        qry += mysql.format(
          " UPDATE `hims_f_billing_header` SET balance_credit= ? WHERE hims_f_billing_header_id=?;",
          [balance_credit, details[i].bill_header_id]
        );
      }

      utilities.logger().log("qry: ", qry);

      _mysql
        .executeQuery({
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
          utilities.logger().log("error: ", e);
          _mysql.rollBackTransaction(() => {
            next(e);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  getPatientwiseBill: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let patient_id = "";

      if (req.connection == null) {
        patient_id = req.query.patient_id;
      } else {
        console.log(
          "req.records.patientRegistration: ",
          req.records.patientRegistration.hims_d_patient_id
        );
        patient_id = req.records.patientRegistration.hims_d_patient_id;
      }
      _mysql
        .executeQuery({
          query:
            "SELECT * from hims_f_billing_header  \
          WHERE record_status='A' AND balance_credit>0 AND patient_id=? \
             order by hims_f_billing_header_id desc",
          values: [patient_id],
          printQuery: true
        })
        .then(result => {
          _mysql.releaseConnection();
          if (req.connection == null) {
            req.records = result;
          } else {
            req.bill_criedt = { bill_criedt: result };
          }

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
  addCreditToDayEnd: (req, res, next) => {
    try {
      const _options = req.connection == null ? {} : req.connection;

      const _mysql = new algaehMysql(_options);
      const utilities = new algaehUtilities();

      _mysql
        .executeQuery({
          query:
            "select product_type from  hims_d_organization where hims_d_organization_id=1\
          and (product_type='HIMS_ERP' or product_type='FINANCE_ERP') limit 1; ",
          printQuery: true
        })
        .then(product_type => {
          if (product_type.length == 1) {
            const inputParam = req.body;

            _mysql
              .executeQuery({
                query:
                  "select finance_accounts_maping_id,account,head_id,child_id from finance_accounts_maping  where \
            account in ( 'CIH_OP', 'OP_REC','CARD_SETTL','OP_WF');",

                printQuery: true
              })
              .then(controls => {
                const OP_WF = controls.find(f => {
                  return f.account == "OP_WF";
                });

                const CIH_OP = controls.find(f => {
                  return f.account == "CIH_OP";
                });

                const OP_REC = controls.find(f => {
                  return f.account == "OP_REC";
                });
                const CARD_SETTL = controls.find(f => {
                  return f.account == "CARD_SETTL";
                });

                let voucher_type = "receipt";
                let narration =
                  " Credit Settlement From Patient:" + inputParam.patient_code;
                let amount = inputParam.receipt_amount;

                const EntriesArray = [];

                EntriesArray.push({
                  payment_date: new Date(),
                  head_id: OP_REC.head_id,
                  child_id: OP_REC.child_id,
                  debit_amount: 0,
                  payment_type: "CR",
                  credit_amount: inputParam.receipt_amount,
                  hospital_id: req.userIdentity.hospital_id
                });

                if (inputParam.write_off_amount > 0) {
                  EntriesArray.push({
                    payment_date: new Date(),
                    head_id: OP_WF.head_id,
                    child_id: OP_WF.child_id,
                    debit_amount: inputParam.write_off_amount,
                    payment_type: "DR",
                    credit_amount: 0,
                    hospital_id: req.userIdentity.hospital_id
                  });
                }
                inputParam.receiptdetails.forEach(m => {
                  if (m.pay_type == "CD") {
                    narration = narration + ",Received By CARD:" + m.amount;

                    EntriesArray.push({
                      payment_date: new Date(),
                      head_id: CARD_SETTL.head_id,
                      child_id: CARD_SETTL.child_id,
                      debit_amount: m.amount,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: req.userIdentity.hospital_id
                    });
                  } else {
                    narration = narration + ",Received By CASH:" + m.amount;
                    EntriesArray.push({
                      payment_date: new Date(),
                      head_id: CIH_OP.head_id,
                      child_id: CIH_OP.child_id,
                      debit_amount: m.amount,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: req.userIdentity.hospital_id
                    });
                  }
                });

                _mysql
                  .executeQueryWithTransaction({
                    query:
                      "INSERT INTO finance_day_end_header (transaction_date,amount,voucher_type,document_id,\
                  document_number,from_screen,narration,entered_by,entered_date) \
                  VALUES (?,?,?,?,?,?,?,?,?)",
                    values: [
                      new Date(),
                      amount,
                      voucher_type,
                      inputParam.receipt_header_id,
                      inputParam.receipt_number,
                      inputParam.ScreenCode,
                      narration,
                      req.userIdentity.algaeh_d_app_user_id,
                      new Date()
                    ],
                    printQuery: true
                  })
                  .then(headerDayEnd => {
                    const month = moment().format("M");
                    const year = moment().format("YYYY");
                    const IncludeValuess = [
                      "payment_date",
                      "head_id",
                      "child_id",
                      "debit_amount",
                      "payment_type",
                      "credit_amount",
                      "hospital_id"
                    ];

                    _mysql
                      .executeQueryWithTransaction({
                        query:
                          "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ;",
                        values: EntriesArray,
                        includeValues: IncludeValuess,
                        bulkInsertOrUpdate: true,
                        extraValues: {
                          year: year,
                          month: month,
                          day_end_header_id: headerDayEnd.insertId
                        },
                        printQuery: true
                      })
                      .then(subResult => {
                        console.log("FOUR");
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
