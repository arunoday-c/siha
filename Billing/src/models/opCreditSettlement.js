import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import mysql from "mysql";
import moment from "moment";
import axios from "axios";
import "regenerator-runtime/runtime";
import dotenv from "dotenv";
if (process.env.NODE_ENV !== "production") dotenv.config();

const processENV = process.env;
const PORTAL_HOST = processENV.PORTAL_HOST ?? "http://localhost:4402/api/v1/";

export default {
  addCreidtSettlement: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      let credit_number = "";

      const utilities = new algaehUtilities();
      // utilities.logger().log("addCreidtSettlement: ");

      inputParam.reciept_header_id =
        req.records === undefined
          ? input.receipt_header_id
          : req.records.receipt_header_id;
      // utilities
      //   .logger()
      //   .log("receipt_header_id: ", inputParam.reciept_header_id);

      _mysql
        .generateRunningNumber({
          user_id: req.userIdentity.algaeh_d_app_user_id,
          numgen_codes: ["OP_CRD"],
          table_name: "hims_f_app_numgen",
        })
        .then((generatedNumbers) => {
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
                new Date(),
              ],
              printQuery: true,
            })
            .then((headerResult) => {
              let IncludeValues = [
                "bill_header_id",
                "include",
                "bill_date",
                "credit_amount",
                "receipt_amount",
                "balance_amount",
                "previous_balance",
                "bill_amount",
              ];

              _mysql
                .executeQuery({
                  query:
                    "INSERT INTO hims_f_credit_detail(??) VALUES ?; \
                  SELECT portal_exists FROM hims_d_hospital where hims_d_hospital_id=" +
                    req.userIdentity.hospital_id +
                    ";",
                  values: inputParam.criedtdetails,
                  includeValues: IncludeValues,
                  extraValues: {
                    credit_header_id: headerResult.insertId,
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true,
                })
                .then(async (credit_detail) => {
                  const portal_exists = credit_detail[1][0].portal_exists;
                  console.log("portal_exists", portal_exists);
                  //   _mysql.commitTransaction(() => {
                  //     _mysql.releaseConnection();

                  if (portal_exists === "Y") {
                    let service_id = [];

                    for (let i = 0; i < inputParam.criedtdetails.length; i++) {
                      if (
                        parseFloat(
                          inputParam.criedtdetails[i].balance_amount
                        ) === 0
                      ) {
                        inputParam.criedtdetails[i].service_data.map((o) => {
                          service_id.push(o.services_id);
                          return o.services_id;
                        });
                      }
                    }

                    const portal_data = {
                      service_id: service_id,
                      visit_code: inputParam.criedtdetails[0].visit_code,
                      patient_identity:
                        inputParam.criedtdetails[0].primary_id_no,
                      report_download: "Y",
                    };

                    console.log("portal_data", portal_data);
                    // consol.log("portal_data", portal_data);
                    await axios
                      .post(
                        `${PORTAL_HOST}/info/deletePatientService`,
                        portal_data
                      )
                      .catch((e) => {
                        throw e;
                      });
                    req.records = {
                      credit_number: credit_number,
                      hims_f_credit_header_id: headerResult.insertId,
                      receipt_number: req.records.receipt_number,
                    };
                    next();
                  } else {
                    req.records = {
                      credit_number: credit_number,
                      hims_f_credit_header_id: headerResult.insertId,
                      receipt_number: req.records.receipt_number,
                    };
                    next();
                  }

                  //   });
                })
                .catch((error) => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            })
            .catch((e) => {
              _mysql.rollBackTransaction(() => {
                next(e);
              });
            });
        })
        .catch((e) => {
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

          printQuery: true,
        })
        .then((headerResult) => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool,
          };
          if (headerResult.length > 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_credit_detail bh inner join hims_f_billing_header as bill on \
                bh.bill_header_id = bill.hims_f_billing_header_id where credit_header_id=?",
                values: [headerResult[0].hims_f_credit_header_id],
                printQuery: true,
              })
              .then((criedtdetails) => {
                // _mysql.releaseConnection();

                req.records = {
                  ...headerResult[0],
                  ...{ criedtdetails },
                  ...{
                    hims_f_receipt_header_id:
                      headerResult[0].cal_receipt_header_id,
                  },
                };
                next();
              })
              .catch((error) => {
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
        .catch((error) => {
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
      // utilities.logger().log("updateOPBilling: ");
      let inputParam = { ...req.body };

      // utilities.logger().log("inputParam: ", inputParam.criedtdetails);

      let details = inputParam.criedtdetails;
      let qry = "";

      // utilities.logger().log("updateOPBilling: ");
      for (let i = 0; i < details.length; i++) {
        let balance_credit =
          details[i].previous_balance - details[i].receipt_amount;
        qry += mysql.format(
          " UPDATE `hims_f_billing_header` SET balance_credit= ? WHERE hims_f_billing_header_id=?;",
          [balance_credit, details[i].bill_header_id]
        );
        if (balance_credit === 0) {
          qry += mysql.format(
            "UPDATE hims_f_lab_order SET credit_order='N' where billing_header_id in (?);",
            [details[i].bill_header_id]
          );
        }
      }

      _mysql
        .executeQuery({
          query: qry,
          printQuery: true,
        })
        .then((result) => {
          // utilities.logger().log("result: ", result);
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.data = result;
            next();
          });
        })
        .catch((e) => {
          // utilities.logger().log("error: ", e);
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
      let strQuery = "";

      if (req.connection == null) {
        patient_id = req.query.patient_id;
        strQuery = mysql.format(
          "SELECT H.*, V.visit_code,P.primary_id_no, D.services_id from hims_f_billing_header H \
            inner join hims_f_billing_details D on D.hims_f_billing_header_id = H.hims_f_billing_header_id \
            inner join hims_f_patient_visit V on V.hims_f_patient_visit_id = H.visit_id\
            inner join hims_f_patient P on P.hims_d_patient_id = H.patient_id\
            WHERE cancelled='N' and adjusted='N' and balance_credit>0 AND H.patient_id=? \
            order by hims_f_billing_header_id desc;",
          [patient_id]
        );
      } else {
        patient_id = req.records.patientRegistration.hims_d_patient_id;
        strQuery = mysql.format(
          "SELECT * from hims_f_billing_header WHERE cancelled='N' and adjusted='N' and \
            balance_credit > 0 AND patient_id=? order by hims_f_billing_header_id desc;",
          [patient_id]
        );
      }
      _mysql
        .executeQuery({
          query: strQuery,
          printQuery: true,
        })
        .then((result) => {
          _mysql.releaseConnection();
          if (req.connection == null) {
            const result_data = _.chain(result)
              .groupBy((it) => it.hims_f_billing_header_id)
              .map((detail, index) => {
                const _head_data = _.head(detail);
                _head_data.bill_header_id = _head_data.hims_f_billing_header_id;
                _head_data.receipt_amount = 0;
                _head_data.balance_amount = _head_data.balance_credit;
                _head_data.previous_balance = _head_data.balance_credit;
                _head_data.bill_amount = _head_data.net_amount;
                return {
                  ..._head_data,
                  service_data: detail,
                };
              })
              .value();
            // console.log("result_data", result_data);
            req.records = result_data;
          } else {
            req.bill_criedt = { bill_criedt: result };
          }

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
          printQuery: true,
        })
        .then((product_type) => {
          if (product_type.length == 1) {
            const inputParam = req.body;

            _mysql
              .executeQuery({
                query:
                  "select finance_accounts_maping_id,account,head_id,child_id from finance_accounts_maping  where \
            account in ( 'CIH_OP', 'OP_REC','CARD_SETTL','OP_WF');",

                printQuery: true,
              })
              .then((controls) => {
                const OP_WF = controls.find((f) => {
                  return f.account == "OP_WF";
                });

                const CIH_OP = controls.find((f) => {
                  return f.account == "CIH_OP";
                });

                const OP_REC = controls.find((f) => {
                  return f.account == "OP_REC";
                });
                const CARD_SETTL = controls.find((f) => {
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
                  hospital_id: req.userIdentity.hospital_id,
                });

                if (inputParam.write_off_amount > 0) {
                  EntriesArray.push({
                    payment_date: new Date(),
                    head_id: OP_WF.head_id,
                    child_id: OP_WF.child_id,
                    debit_amount: inputParam.write_off_amount,
                    payment_type: "DR",
                    credit_amount: 0,
                    hospital_id: req.userIdentity.hospital_id,
                  });
                }
                inputParam.receiptdetails.forEach((m) => {
                  if (m.pay_type == "CD") {
                    narration = narration + ",Received By CARD:" + m.amount;

                    EntriesArray.push({
                      payment_date: new Date(),
                      head_id: CARD_SETTL.head_id,
                      child_id: CARD_SETTL.child_id,
                      debit_amount: m.amount,
                      payment_type: "DR",
                      credit_amount: 0,
                      hospital_id: req.userIdentity.hospital_id,
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
                      hospital_id: req.userIdentity.hospital_id,
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
                      new Date(),
                    ],
                    printQuery: true,
                  })
                  .then((headerDayEnd) => {
                    const month = moment().format("M");
                    const year = moment().format("YYYY");
                    const IncludeValuess = [
                      "payment_date",
                      "head_id",
                      "child_id",
                      "debit_amount",
                      "payment_type",
                      "credit_amount",
                      "hospital_id",
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
                          day_end_header_id: headerDayEnd.insertId,
                        },
                        printQuery: true,
                      })
                      .then((subResult) => {
                        console.log("FOUR");
                        next();
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
              })
              .catch((error) => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          } else {
            next();
          }
        })
        .catch((error) => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
};
