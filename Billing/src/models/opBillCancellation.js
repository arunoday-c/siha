import algaehMysql from "algaeh-mysql";
import _ from "lodash";
import algaehUtilities from "algaeh-utilities/utilities";
import appsettings from "algaeh-utilities/appsettings.json";

export default {
  addOpBillCancellation: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      let bill_cancel_number = "";

      inputParam.receipt_header_id = req.records.receipt_header_id;

      _mysql
        .generateRunningNumber({
          modules: ["OP_CBIL"],
          tableName: "hims_f_app_numgen",
          identity: {
            algaeh_d_app_user_id: req.userIdentity.algaeh_d_app_user_id,
            hospital_id: req.userIdentity.hospital_id
          }
        })
        .then(generatedNumbers => {
          bill_cancel_number = generatedNumbers[0];

          _mysql
            .executeQuery({
              query:
                "INSERT INTO hims_f_bill_cancel_header ( bill_cancel_number, patient_id, visit_id,\
                  from_bill_id,receipt_header_id, incharge_or_provider, bill_cancel_date, advance_amount,\
                  advance_adjust, discount_amount, sub_total_amount, total_tax,  billing_status,\
                  sheet_discount_amount, sheet_discount_percentage, net_amount, net_total, company_res,\
                  sec_company_res, patient_res, patient_payable, company_payable, sec_company_payable, \
                  patient_tax, company_tax, sec_company_tax, net_tax, credit_amount, payable_amount, \
                  created_by, created_date, updated_by, updated_date, copay_amount, sec_copay_amount,\
                  deductable_amount, sec_deductable_amount, cancel_remarks, hospital_id ) \
                    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
              values: [
                bill_cancel_number,
                inputParam.patient_id,
                inputParam.visit_id,
                inputParam.from_bill_id,
                inputParam.receipt_header_id,
                inputParam.incharge_or_provider,
                inputParam.bill_cancel_date != null
                  ? new Date(inputParam.bill_cancel_date)
                  : inputParam.bill_cancel_date,
                inputParam.advance_amount,
                inputParam.advance_adjust,
                inputParam.discount_amount,
                inputParam.sub_total_amount,
                inputParam.total_tax,
                inputParam.billing_status,
                inputParam.sheet_discount_amount,
                inputParam.sheet_discount_percentage,
                inputParam.net_amount,
                inputParam.net_total,
                inputParam.company_res,
                inputParam.sec_company_res,
                inputParam.patient_res,
                inputParam.patient_payable,
                inputParam.company_payable,
                inputParam.sec_company_payable,
                inputParam.patient_tax,
                inputParam.company_tax,
                inputParam.sec_company_tax,
                inputParam.net_tax,
                inputParam.credit_amount,
                inputParam.payable_amount,
                inputParam.created_by,
                new Date(),
                inputParam.updated_by,
                new Date(),
                inputParam.copay_amount,
                inputParam.sec_copay_amount,
                inputParam.deductable_amount,
                inputParam.sec_deductable_amount,
                inputParam.cancel_remarks,
                req.userIdentity.hospital_id
              ],
              printQuery: true
            })
            .then(headerResult => {
              let IncludeValues = [
                "service_type_id",
                "services_id",
                "quantity",
                "unit_cost",
                "insurance_yesno",
                "gross_amount",
                "discount_amout",
                "discount_percentage",
                "net_amout",
                "copay_percentage",
                "copay_amount",
                "deductable_amount",
                "deductable_percentage",
                "tax_inclusive",
                "patient_tax",
                "company_tax",
                "total_tax",
                "patient_resp",
                "patient_payable",
                "comapany_resp",
                "company_payble",
                "sec_company",
                "sec_deductable_percentage",
                "sec_deductable_amount",
                "sec_company_res",
                "sec_company_tax",
                "sec_company_paybale",
                "sec_copay_percntage",
                "sec_copay_amount"
              ];

              _mysql
                .executeQuery({
                  query: "INSERT INTO hims_f_bill_cancel_details(??) VALUES ?",
                  values: inputParam.billdetails,
                  includeValues: IncludeValues,
                  extraValues: {
                    hims_f_bill_cancel_header_id: headerResult.insertId,
                    created_by: req.userIdentity.algaeh_d_app_user_id,
                    created_date: new Date(),
                    updated_by: req.userIdentity.algaeh_d_app_user_id,
                    updated_date: new Date()
                  },
                  bulkInsertOrUpdate: true,
                  printQuery: true
                })
                .then(leave_detail => {
                  //   _mysql.commitTransaction(() => {
                  //     _mysql.releaseConnection();
                  req.records = {
                    bill_number: bill_cancel_number,
                    hims_f_bill_cancel_header_id: headerResult.insertId,
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

  getBillCancellation: (req, res, next) => {
    const _mysql = new algaehMysql();
    try {
      _mysql
        .executeQuery({
          query:
            "SELECT *, bh.receipt_header_id as cal_receipt_header_id FROM hims_f_bill_cancel_header bh \
          inner join hims_f_patient as PAT on bh.patient_id = PAT.hims_d_patient_id\
          inner join hims_f_patient_visit as vst on bh.visit_id = vst.hims_f_patient_visit_id\
          inner join hims_f_billing_header as bill on BH.from_bill_id = bill.hims_f_billing_header_id \
          where bh.record_status='A' AND bh.bill_cancel_number='" +
            req.query.bill_cancel_number +
            "'",

          printQuery: true
        })
        .then(headerResult => {
          req.connection = {
            connection: _mysql.connection,
            isTransactionConnection: _mysql.isTransactionConnection,
            pool: _mysql.pool
          };
          if (headerResult.length != 0) {
            _mysql
              .executeQuery({
                query:
                  "select * from hims_f_bill_cancel_details where hims_f_bill_cancel_header_id=? and record_status='A'",
                values: [headerResult[0].hims_f_bill_cancel_header_id],
                printQuery: true
              })
              .then(billdetails => {
                // _mysql.releaseConnection();

                req.records = {
                  ...headerResult[0],
                  ...{ billdetails },
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
      let inputParam = { ...req.body };

      _mysql
        .executeQuery({
          query:
            "UPDATE `hims_f_billing_header` SET `cancelled`=?, `cancel_remarks`=?,`cancel_by` = ?,`updated_date` = ? \
          WHERE `hims_f_billing_header_id`=?",
          values: [
            "Y",
            inputParam.cancel_remarks,
            req.userIdentity.algaeh_d_app_user_id,
            new Date(),
            inputParam.from_bill_id
          ],
          printQuery: true
        })
        .then(result => {
          _mysql.commitTransaction(() => {
            _mysql.releaseConnection();
            req.data = result;
            next();
          });
        })
        .catch(e => {
          _mysql.rollBackTransaction(() => {
            next(error);
          });
        });
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  updateEncounterDetails: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      const utilities = new algaehUtilities();
      utilities
        .logger()
        .log("updateEncounterDetails: ", inputParam.billdetails);

      const bill_consultation = _.filter(
        inputParam.billdetails,
        f =>
          f.service_type_id ==
          appsettings.hims_d_service_type.service_type_id.Consultation
      );
      utilities.logger().log("bill_consultation: ", bill_consultation.length);
      if (bill_consultation.length > 0) {
        _mysql
          .executeQuery({
            query:
              "SELECT encounter_id, checked_in FROM `hims_f_patient_encounter` WHERE `visit_id`=?",
            values: [inputParam.visit_id],
            printQuery: true
          })
          .then(patient_encounter => {
            utilities
              .logger()
              .log("checked_in: ", patient_encounter[0].checked_in);
            if (patient_encounter[0].checked_in == "Y") {
              req.patientencounter = {
                internal_error: true,
                message: "Already Consultation done you cannot cancel"
              };
              _mysql.rollBackTransaction(() => {
                next();
              });
            } else {
              _mysql
                .executeQuery({
                  query:
                    "UPDATE `hims_f_patient_encounter` SET `cancelled`=?, `cancelled_by` = ?,`created_date` = ? \
                  WHERE `visit_id`=?",
                  values: [
                    "Y",
                    req.userIdentity.algaeh_d_app_user_id,
                    new Date(),
                    inputParam.visit_id
                  ],
                  printQuery: true
                })
                .then(result => {
                  req.patientencounter = {
                    ...result[0],
                    ...{
                      internal_error: false
                    }
                  };
                  next();
                })
                .catch(e => {
                  _mysql.rollBackTransaction(() => {
                    next(error);
                  });
                });
            }
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        req.patientencounter = {
          internal_error: false
        };
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },
  checkLabSampleCollected: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      const utilities = new algaehUtilities();
      utilities
        .logger()
        .log("checkLabSampleCollected: ", inputParam.billdetails);

      const Lab_Services = _.filter(
        inputParam.billdetails,
        f =>
          f.service_type_id ==
          appsettings.hims_d_service_type.service_type_id.Lab
      );
      utilities.logger().log("Lab_Services: ", Lab_Services.length);
      if (Lab_Services.length > 0) {
        let _service_id = _.map(Lab_Services, o => {
          return o.services_id;
        });
        utilities.logger().log("_service_id: ", _service_id.length);
        _mysql
          .executeQuery({
            query:
              "SELECT ordered_services_id, hims_f_lab_order_id, status FROM `hims_f_lab_order` WHERE `visit_id`=? and service_id in (?)",
            values: [inputParam.visit_id, _service_id],
            printQuery: true
          })
          .then(lab_data_result => {
            if (lab_data_result.length > 0) {
              utilities.logger().log("checked_in: ", lab_data_result);
              const Lab_Services_Collected = _.filter(
                lab_data_result,
                f => f.status != "O"
              );

              if (Lab_Services_Collected.length > 0) {
                req.laboratory = {
                  internal_error: true,
                  message:
                    "Already Sample Collected for Laboratory cannot cancel"
                };
                _mysql.rollBackTransaction(() => {
                  next();
                });
              } else {
                let strQry = "";

                for (let i = 0; i < lab_data_result.length; i++) {
                  strQry += _mysql.mysqlQueryFormat(
                    "DELETE FROM hims_f_ord_analytes where order_id=?; DELETE FROM hims_f_lab_sample where order_id=?;\
                  DELETE FROM hims_f_lab_order where hims_f_lab_order_id=?;",
                    [
                      lab_data_result[i].hims_f_lab_order_id,
                      lab_data_result[i].hims_f_lab_order_id,
                      lab_data_result[i].hims_f_lab_order_id
                    ]
                  );
                  if (lab_data_result[i].ordered_services_id != null) {
                    strQry += _mysql.mysqlQueryFormat(
                      "UPDATE hims_f_ordered_services SET billed='N' where hims_f_ordered_services_id=?;",
                      [lab_data_result[i].ordered_services_id]
                    );
                  }
                }
                _mysql
                  .executeQuery({
                    query: strQry,
                    printQuery: true
                  })
                  .then(result => {
                    req.laboratory = {
                      ...result[0],
                      ...{
                        internal_error: false
                      }
                    };
                    next();
                  })
                  .catch(e => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              }
            } else {
              req.laboratory = {
                internal_error: false
              };
              next();
            }
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        req.laboratory = {
          internal_error: false
        };
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(error);
      });
    }
  },

  checkRadSheduled: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      const utilities = new algaehUtilities();
      utilities.logger().log("checkRadSheduled: ", inputParam.billdetails);

      const Rad_Services = _.filter(
        inputParam.billdetails,
        f =>
          f.service_type_id ==
          appsettings.hims_d_service_type.service_type_id.Radiology
      );
      utilities.logger().log("Rad_Services: ", Rad_Services.length);
      if (Rad_Services.length > 0) {
        let _service_id = _.map(Rad_Services, o => {
          return o.services_id;
        });
        utilities.logger().log("Rad_service_id: ", _service_id.length);
        _mysql
          .executeQuery({
            query:
              "SELECT ordered_services_id, hims_f_rad_order_id, status FROM `hims_f_rad_order` WHERE `visit_id`=? and service_id in (?)",
            values: [inputParam.visit_id, _service_id],
            printQuery: true
          })
          .then(rad_data_result => {
            if (rad_data_result.length > 0) {
              utilities.logger().log("rad_date: ", rad_data_result);
              const Rad_Services_Sheduled = _.filter(
                rad_data_result,
                f => f.status != "O"
              );

              if (Rad_Services_Sheduled.length > 0) {
                req.radiology = {
                  internal_error: true,
                  message: "Already Sheduled for Radiology cannot cancel"
                };
                _mysql.rollBackTransaction(() => {
                  next();
                });
              } else {
                let strQry = "";

                for (let i = 0; i < rad_data_result.length; i++) {
                  strQry += _mysql.mysqlQueryFormat(
                    "DELETE FROM hims_f_rad_order where hims_f_rad_order_id=?;",
                    [rad_data_result[i].hims_f_rad_order_id]
                  );
                  if (rad_data_result[i].ordered_services_id != null) {
                    strQry += _mysql.mysqlQueryFormat(
                      "UPDATE hims_f_ordered_services SET billed='N' where hims_f_ordered_services_id=?;",
                      [rad_data_result[i].ordered_services_id]
                    );
                  }
                }
                _mysql
                  .executeQuery({
                    query: strQry,
                    printQuery: true
                  })
                  .then(result => {
                    req.radiology = {
                      ...result[0],
                      ...{
                        internal_error: false
                      }
                    };
                    next();
                  })
                  .catch(e => {
                    _mysql.rollBackTransaction(() => {
                      next(error);
                    });
                  });
              }
            } else {
              req.radiology = {
                internal_error: false
              };
              next();
            }
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        req.radiology = {
          internal_error: false
        };
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },

  checkDentalProcedure: (req, res, next) => {
    const _options = req.connection == null ? {} : req.connection;
    const _mysql = new algaehMysql(_options);
    try {
      let inputParam = { ...req.body };
      console.log("checkDentalProcedure: ", inputParam.billdetails);

      const dental_Services = _.filter(
        inputParam.billdetails,
        f =>
          f.service_type_id ==
            appsettings.hims_d_service_type.service_type_id.Procedure &&
          f.ordered_services_id != null
      );
      console.log("dental_Services: ", dental_Services.length);
      if (dental_Services.length > 0) {
        let ordered_services_id = _.map(dental_Services, o => {
          return o.ordered_services_id;
        });
        console.log("ordered_services_id: ", ordered_services_id.length);
        _mysql
          .executeQuery({
            query:
              "SELECT d_treatment_id FROM `hims_f_ordered_services` WHERE hims_f_ordered_services_id in (?)",
            values: [ordered_services_id],
            printQuery: true
          })
          .then(dental_ordr_result => {
            let d_treatment_id = _.map(dental_ordr_result, o => {
              return o.d_treatment_id;
            });
            _mysql
              .executeQuery({
                query:
                  "SELECT hims_f_dental_treatment_id, treatment_status FROM `hims_f_dental_treatment` WHERE hims_f_dental_treatment_id in (?)",
                values: [d_treatment_id],
                printQuery: true
              })
              .then(dental_data_result => {
                if (dental_data_result.length > 0) {
                  console.log("dental_data_result: ", dental_data_result);
                  const den_Services_Proce = _.filter(
                    dental_data_result,
                    f => f.treatment_status != "PL"
                  );

                  if (den_Services_Proce.length > 0) {
                    req.dental_procedure = {
                      internal_error: true,
                      message: "Already Procedure Done."
                    };
                    _mysql.rollBackTransaction(() => {
                      next();
                    });
                  } else {
                    let strQry = "";

                    for (let i = 0; i < dental_data_result.length; i++) {
                      strQry += _mysql.mysqlQueryFormat(
                        "UPDATE hims_f_dental_treatment SET billed='N' where hims_f_dental_treatment_id=?;",
                        [dental_data_result[i].hims_f_dental_treatment_id]
                      );
                      strQry += _mysql.mysqlQueryFormat(
                        "UPDATE hims_f_ordered_services SET billed='N' where d_treatment_id=?;",
                        [dental_data_result[i].hims_f_dental_treatment_id]
                      );
                    }
                    _mysql
                      .executeQuery({
                        query: strQry,
                        printQuery: true
                      })
                      .then(result => {
                        req.dental_procedure = {
                          ...result[0],
                          ...{
                            internal_error: false
                          }
                        };
                        next();
                      })
                      .catch(e => {
                        _mysql.rollBackTransaction(() => {
                          next(error);
                        });
                      });
                  }
                } else {
                  req.dental_procedure = {
                    internal_error: false
                  };
                  next();
                }
              })
              .catch(e => {
                _mysql.rollBackTransaction(() => {
                  next(error);
                });
              });
          })
          .catch(e => {
            _mysql.rollBackTransaction(() => {
              next(error);
            });
          });
      } else {
        req.dental_procedure = {
          internal_error: false
        };
        next();
      }
    } catch (e) {
      _mysql.rollBackTransaction(() => {
        next(e);
      });
    }
  },
  financeOpBillCancel: (req, res, next) => {
    try {
      const _options = req.connection == null ? {} : req.connection;

      const _mysql = new algaehMysql(_options);

      const utilities = new algaehUtilities();

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
            const inputParam = req.body;

            let narration = "OP BILL CANCELLATION";
            let transaction_type = "OP_BIL_CAN";
            let amount = inputParam.receiveable_amount;
            let control_account = "OP_CON";

            utilities.logger().log("inputParamRR: ", inputParam);
            _mysql
              .executeQueryWithTransaction({
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
                printQuery: false
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
                    printQuery: false
                  })
                  .then(detail => {
                    let fetchServiceDetails = "";
                    if (
                      inputParam.billdetails &&
                      inputParam.billdetails.length > 0
                    ) {
                      const servicesIds = inputParam.billdetails.map(m => {
                        return m.services_id;
                      });
                      fetchServiceDetails = ` SELECT hims_d_services_id,service_type_id,head_id,child_id FROM hims_d_services
                        where hims_d_services_id in(${servicesIds}); `;
                    }

                    _mysql
                      .executeQuery({
                        query:
                          "SELECT * FROM finance_accounts_maping;\
                           select * from finance_day_end_detail where day_end_header_id=?; " +
                          fetchServiceDetails,
                        values: [
                          headerDayEnd.insertId,
                          inputParam.bank_card_id
                        ],
                        printQuery: false
                      })
                      .then(rest => {
                        const controlResult = rest[0];
                        const day_end_detail = rest[1];

                        const OP_DEP = controlResult.find(f => {
                          return f.account == "OP_DEP";
                        });

                        const CH_IN_HA = controlResult.find(f => {
                          return f.account == "CH_IN_HA";
                        });
                        // const OP_CON = controlResult.find(f => {
                        //   return f.account == "OP_CON";
                        // });
                        const OP_REC = controlResult.find(f => {
                          return f.account == "OP_REC";
                        });

                        let insertSubDetail = [];

                        //------------------------4444

                        //finall insert
                        new Promise((resolve, reject) => {
                          try {
                            if (inputParam.billdetails.length > 0) {
                              if (inputParam.insured != "Y") {
                                rest[2].forEach(curService => {
                                  const serviceData = inputParam.billdetails.find(
                                    f => {
                                      if (
                                        f.services_id ==
                                        curService.hims_d_services_id
                                      )
                                        return f;
                                    }
                                  );

                                  console.log(
                                    "ammount MY:",
                                    serviceData.patient_payable
                                  );

                                  insertSubDetail.push({
                                    day_end_header_id: headerDayEnd.insertId,
                                    payment_date: new Date(),

                                    head_id: curService.head_id,
                                    child_id: curService.child_id,
                                    debit_amount: serviceData.patient_payable,
                                    payment_type: "DR",
                                    credit_amount: 0,
                                    narration: "OP BILL CANCELATION",
                                    hospital_id: req.userIdentity.hospital_id
                                  });
                                });

                                insertSubDetail.push({
                                  day_end_header_id: headerDayEnd.insertId,
                                  payment_date: new Date(),

                                  head_id: CH_IN_HA.head_id,
                                  child_id: CH_IN_HA.child_id,
                                  debit_amount: 0,
                                  payment_type: "CR",
                                  credit_amount: inputParam.receiveable_amount,
                                  narration: "OP BILL CANCELATION",
                                  hospital_id: req.userIdentity.hospital_id
                                });

                                if (inputParam.credit_amount > 0) {
                                  insertSubDetail.push({
                                    day_end_header_id: headerDayEnd.insertId,
                                    payment_date: new Date(),

                                    head_id: OP_REC.head_id,
                                    child_id: OP_REC.child_id,
                                    debit_amount: 0,
                                    payment_type: "CR",
                                    credit_amount: inputParam.credit_amount,
                                    narration: "OP BILL CANCELATION",
                                    hospital_id: req.userIdentity.hospital_id
                                  });
                                }

                                if (inputParam.advance_adjust > 0) {
                                  insertSubDetail.push({
                                    day_end_header_id: headerDayEnd.insertId,
                                    payment_date: new Date(),

                                    head_id: OP_DEP.head_id,
                                    child_id: OP_DEP.child_id,
                                    debit_amount: 0,
                                    payment_type: "CR",
                                    credit_amount: inputParam.advance_adjust,
                                    narration: "PATIENT OP BILL CANCEL",
                                    hospital_id: req.userIdentity.hospital_id
                                  });
                                }

                                resolve({});
                              } else {
                                next();
                              }
                            } else {
                              next();
                            }
                          } catch (e) {
                            reject(e);
                          }
                        })
                          .then(rests => {
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
                                printQuery: false
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
