import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";

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
          modules: ["OP_CRD"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity.hospital_id
          }
        })
        .then(generatedNumbers => {
          credit_number = generatedNumbers[0];

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
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    const utilities = new algaehUtilities();
    try {
      let inputParam = req.body;
      utilities.logger().log("inputParamRR: ", inputParam);
      _mysql
        .executeQuery({
          query:
            "select product_type from hims_d_hospital where hims_d_hospital_id=?  and \
            (product_type='HIMS_ERP' or product_type='HRMS_ERP' or product_type='FINANCE_ERP');",
          values: [req.userIdentity.hospital_id],
          printQuery: true
        })
        .then(result => {
          if (result.length > 0) {
            let narration = "OP BILL CREDIT SETTELMENT";
            let transaction_type = "CREDIT_ST";
            let amount = inputParam.recievable_amount;
            let control_account = "OP_CON";

            _mysql
              .executeQuery({
                query:
                  "INSERT INTO finance_day_end_header (transaction_date,amount,control_account,document_type,document_id,\
                document_number,from_screen,transaction_type,customer_type,narration,hospital_id) \
                VALUES (?,?,?,?,?,?,?,?,?,?,?)",
                values: [
                  new Date(),
                  amount,
                  control_account,
                  "RECEIPT",
                  inputParam.receipt_header_id,
                  inputParam.receipt_number,
                  inputParam.ScreenCode,
                  transaction_type,
                  "P",
                  narration,
                  req.userIdentity.hospital_id
                ],
                printQuery: true
              })
              .then(headerDayEnd => {
                const insertDetail = inputParam.receiptdetails.map(m => {
                  return {
                    amount: m.amount,
                    payment_mode: m.pay_type
                  };
                });
                const IncludeValues = ["amount", "payment_mode"];
                _mysql
                  .executeQueryWithTransaction({
                    query: "INSERT INTO finance_day_end_detail (??) VALUES ? ",
                    values: insertDetail,
                    includeValues: IncludeValues,
                    bulkInsertOrUpdate: true,
                    extraValues: {
                      day_end_header_id: headerDayEnd["insertId"]
                    },
                    printQuery: true
                  })
                  .then(detail => {
                    _mysql
                      .executeQuery({
                        query:
                          "SELECT * FROM finance_accounts_maping;\
                    select * from finance_day_end_detail where day_end_header_id=?;\
                    SELECT head_id,child_id FROM hims_d_bank_card where hims_d_bank_card_id=?;",
                        values: [
                          headerDayEnd.insertId,
                          inputParam.bank_card_id
                        ],
                        printQuery: true
                      })
                      .then(rest => {
                        const controlResult = rest[0];
                        const day_end_detail = rest[1];

                        const OP_REC = controlResult.find(f => {
                          return f.account == "OP_REC";
                        });
                        const CH_IN_HA = controlResult.find(f => {
                          return f.account == "CH_IN_HA";
                        });

                        const OP_WF = controlResult.find(f => {
                          return f.account == "OP_WF";
                        });

                        let insertSubDetail = [];

                        day_end_detail.forEach(item => {
                          if (item.payment_mode == "CA") {
                            insertSubDetail.push({
                              day_end_header_id: headerDayEnd.insertId,
                              payment_date: new Date(),

                              head_id: CH_IN_HA.head_id,
                              child_id: CH_IN_HA.child_id,
                              debit_amount: item.amount,
                              payment_type: "DR",
                              credit_amount: 0,
                              narration: " PATIENT CREDIT SETTLEMENT BY CASH",
                              hospital_id: req.userIdentity.hospital_id
                            });
                          }

                          if (item.payment_mode == "CD") {
                            insertSubDetail.push({
                              day_end_header_id: headerDayEnd.insertId,
                              payment_date: new Date(),

                              head_id: rest[2][0].head_id,
                              child_id: rest[2][0].child_id,
                              debit_amount: item.amount,
                              payment_type: "DR",
                              credit_amount: 0,
                              narration: "PATIENT CREDIT SETTLEMENT BY CARD",
                              hospital_id: req.userIdentity.hospital_id
                            });
                          }
                        });
                        if (inputParam.write_off_amount > 0) {
                          insertSubDetail.push({
                            day_end_header_id: headerDayEnd.insertId,
                            payment_date: new Date(),

                            head_id: OP_WF.head_id,
                            child_id: OP_WF.child_id,
                            debit_amount: inputParam.write_off_amount,
                            payment_type: "DR",
                            credit_amount: 0,
                            narration: "PATIENT OP BILL WRITE OFF",
                            hospital_id: req.userIdentity.hospital_id
                          });
                        }

                        insertSubDetail.push({
                          day_end_header_id: headerDayEnd.insertId,
                          payment_date: new Date(),

                          head_id: OP_REC.head_id,
                          child_id: OP_REC.child_id,
                          debit_amount: 0,
                          payment_type: "CR",
                          credit_amount:
                            parseFloat(amount) +
                            parseFloat(inputParam.write_off_amount),
                          narration: "OP BILL CREDIT SETTLEMENT DONE",
                          hospital_id: req.userIdentity.hospital_id
                        });

                        const IncludeValuess = [
                          "day_end_header_id",
                          "payment_date",

                          "head_id",
                          "child_id",
                          "debit_amount",
                          "payment_type",
                          "credit_amount",
                          "narration"
                        ];
                        _mysql
                          .executeQueryWithTransaction({
                            query:
                              "INSERT INTO finance_day_end_sub_detail (??) VALUES ? ",
                            values: insertSubDetail,
                            includeValues: IncludeValuess,
                            bulkInsertOrUpdate: true,
                            printQuery: true
                          })
                          .then(subResult => {
                            console.log("FIVE:");
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
              })
              .catch(error => {
                _mysql.releaseConnection();
                next(error);
              });

            //-----------------------------------
          } else {
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
  }
};
