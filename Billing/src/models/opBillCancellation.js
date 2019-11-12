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
  }
};
